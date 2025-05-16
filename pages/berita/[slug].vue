<template>
    <div class="max-w-3xl mx-auto px-5 py-8">


        <div v-if="pending" class="text-center my-12">
            <p>Memuat berita...</p>
        </div>
        
        <div v-else-if="error" class="text-center my-12">
            <p>{{ error }}</p>
            <NuxtLink to="/berita" class="inline-block mt-4 bg-gray-100 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-200">
                Kembali ke daftar berita
            </NuxtLink>
        </div>
        
        <div v-else-if="newsData" class="content">
            <div class="mb-6">
                <div class="flex justify-between items-center">
                    <NuxtLink to="/berita" class="inline-block mb-5 text-gray-600 hover:text-gray-800">
                        &larr; Kembali ke daftar berita
                    </NuxtLink>
                    <button v-if="isLoggedIn" @click="showEditModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        Edit Berita
                    </button>
                </div>
                <h1 class="text-3xl font-bold mb-2">{{ newsData.title }}</h1>
                <p class="text-sm text-gray-600 mb-5">{{ formatDate(newsData.created_at) }}</p>
            </div>
            
            <div v-if="newsData.thumbnail_url" class="mb-5">
                <img :src="newsData.thumbnail_url" :alt="newsData.title" class="max-h-[50dvh]  rounded-lg object-cover" />
            </div>
            
            <div class="leading-relaxed">
                <article class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none">
  <div v-html="newsData.content"></div>
</article>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Edit Berita</h2>
                    <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700">
                        &times; <!-- Close button -->
                    </button>
                </div>
                
                <form @submit.prevent="submitUpdate" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                        <input 
                            v-model="form.title" 
                            type="text" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        >
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Konten</label>
                        <textarea 
                            v-model="form.content" 
                            rows="5" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        ></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                        <input 
                            @change="handleFileUpload" 
                            type="file" 
                            accept="image/*" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                        <p v-if="newsData.thumbnail_url" class="text-sm text-gray-500 mt-1">
                            Thumbnail saat ini akan tetap digunakan jika tidak mengunggah yang baru
                        </p>
                    </div>
                    
                    <div class="flex justify-end pt-4">
                        <button 
                            type="button" 
                            @click="showEditModal = false"
                            class="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            :disabled="isSubmitting"
                        >
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

onMounted(async () => {
    await fetchNewsBySlug(route.params.slug);
    
    
});

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

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};
</script>
