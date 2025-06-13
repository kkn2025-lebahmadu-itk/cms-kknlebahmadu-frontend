<template>
    <div class="bg-KKNWhite dark:bg-KKNBlack w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-black dark:text-white">
      <div v-if="pending" class="text-center my-12">
        <p>Memuat berita...</p>
      </div>
  
      <div v-else-if="error" class="text-center my-12">
        <p>{{ error }}</p>
        <NuxtLink to="/admin/berita" class="inline-block mt-4 bg-gray-100 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          Kembali ke daftar berita
        </NuxtLink>
      </div>
  
      <div v-else-if="newsData" class="content max-w-7xl mx-auto w-full px-4">
        <div class="mb-6">
          <div class="flex justify-between items-center">
            <NuxtLink to="/berita" class="inline-block mb-5 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
              &larr; Kembali ke daftar berita
            </NuxtLink>
            <button v-if="isLoggedIn" @click="showEditModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md dark:bg-blue-600 dark:hover:bg-blue-700">
              Edit Berita
            </button>
          </div>
          <h1 class="text-3xl font-bold mb-2 dark:text-white">{{ newsData?.title }}</h1>
          <p class="text-sm text-gray-600 mb-5 dark:text-gray-400">{{ formatDate(newsData?.created_at) }}</p>
        </div>
  
        <div v-if="newsData?.thumbnail_url" class="mb-5 flex items-center justify-center">
          <img :src="newsData?.thumbnail_url" :alt="newsData.title" class="max-h-[50dvh] rounded-lg object-cover" />
        </div>
  
        <div class="leading-relaxed">
          <article class="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
            <div class="preview-content" v-html="newsData?.content"></div>
          </article>
        </div>
      </div>
  
      <!-- Edit Modal -->
      <div v-show="showEditModal" @click.self="showEditModal = !showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-KKNBlack rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold dark:text-white">Edit Berita</h2>
            <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              &times;
            </button>
          </div>
  
          <form @submit.prevent="submitUpdate" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Judul</label>
              <input v-model="form.title" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-KKNBlack text-black dark:text-white" required>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Thumbnail</label>
              <input @change="handleFileUpload" type="file" accept="image/*" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-KKNBlack text-black dark:text-white">
              <p v-if="newsData?.thumbnail_url" class="text-sm text-gray-500 mt-1 dark:text-gray-400">
                Thumbnail saat ini akan tetap digunakan jika tidak mengunggah yang baru
              </p>
            </div>
  
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Konten</label>
              <div ref="editEditorRef" class="min-h-[200px] bg-white dark:bg-KKNBlack border border-gray-300 dark:border-gray-700 rounded-md p-2 text-black dark:text-white"></div>
            </div>
  

            <div class="flex justify-end pt-4">
              <button type="button" @click="showEditModal = false" class="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                Batal
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700" :disabled="isSubmitting">
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  

<script setup>
const refreshToken = useCookie('refresh_token');
const isLoggedIn = computed(() => {
  return !!refreshToken.value
})

const { $quill } = useNuxtApp()

const route = useRoute();
const { response, pending, error, fetchNewsBySlug, updateNews } = useNews();
const newsData = computed(() => response.value?.data.data || null);
const showEditModal = ref(false);
const isSubmitting = ref(false);
const updateError = ref(null);

const form = ref({
    title: '',
    content: '',
    thumbnail: null
});

// Initialize form when news data is loaded
watch(newsData, (val) => {
    if (val) {
        form.value.title = val.title;
        form.value.content = val.content;
    }
}, { immediate: true });


watch(showEditModal, async (value) => {
  if (value) {
    await nextTick();

    if (!$quill || !editEditorRef.value) {
      console.error('❌ $quill tidak tersedia');
      return;
    }

    if (!editQuillInstance) {
      editQuillInstance = new $quill(editEditorRef.value, {
        theme: 'snow',
        placeholder: 'Tulis berita di sini...',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'blockquote', 'code-block', 'image'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }]
          ]
        }
      });

      editQuillInstance.on('text-change', () => {
        form.value.content = editQuillInstance.root.innerHTML;
      });
    }

    // ✅ Set ulang konten saat modal dibuka
    editQuillInstance.root.innerHTML = form.value.content || '';
  }
});


onMounted(async () => {
  await fetchNewsBySlug(route.params.slug)

  // Delay untuk pastikan DOM modal sudah pernah ada di page (bisa invisible pakai v-show)
  await nextTick()

  if (editEditorRef.value && !$quill) {
    console.error('❌ $quill tidak tersedia')
    return
  }

  // Inisialisasi sekali saja
  editQuillInstance = new $quill(editEditorRef.value, {
    theme: 'snow',
    placeholder: 'Tulis berita di sini...',
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['link', 'blockquote', 'code-block', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }]
      ]
    }
  })

  editQuillInstance.on('text-change', () => {
    form.value.content = editQuillInstance.root.innerHTML
  })
})


const handleFileUpload = (event) => {
    form.value.thumbnail = event.target.files[0] || null;
};

const submitUpdate = async () => {
    isSubmitting.value = true;
    updateError.value = null;
    
    try {
        // Create FormData for multipart/form-data request
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('content', form.value.content);
        
        if (form.value.thumbnail) {
            formData.append('thumbnail', form.value.thumbnail);
        }
        
        await updateNews(route.params.slug, formData);
        
        // Refresh data
        await fetchNewsBySlug(route.params.slug);
        showEditModal.value = false;
        
    } catch (err) {
        updateError.value = err.message || 'Terjadi kesalahan saat mengupdate berita';
    } finally {
        isSubmitting.value = false;
    }
};
const editEditorRef = ref(null)
let editQuillInstance = null




console.log('editEditorRef', editEditorRef.value)
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};
</script>

<style >

</style>