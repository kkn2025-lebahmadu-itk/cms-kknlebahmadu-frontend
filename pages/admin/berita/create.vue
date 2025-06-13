<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Tambah Berita</h1>
      <NewsForm />
    </div>
  </template>
  
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useCookie, useRoute, useNuxtApp, navigateTo } from '#app'
import { useNews } from '~/composables/useNews'

const refreshToken = useCookie('refresh_token')
const isLoggedIn = computed(() => !!refreshToken.value)

const route = useRoute()
const { response, pending, error, fetchNewsBySlug, updateNews } = useNews()
const newsData = computed(() => response.value?.data.data || null)

const showEditModal = ref(false)
const isSubmitting = ref(false)
const updateError = ref(null)

// Form reactive
const form = ref({
  title: '',
  content: '',
  thumbnail: null
})

// refs untuk Quill
const editorRef = ref(null)
let quillInstance = null
const { $quill } = useNuxtApp()

// Saat data news tiba, isi form
watch(newsData, (val) => {
  if (val) {
    form.value.title   = val.title
    form.value.content = val.content
  }
}, { immediate: true })

// Fetch awal
onMounted(() => {
  fetchNewsBySlug(route.params.slug)
})

// Inisialisasi Quill setiap kali modal dibuka
watch(showEditModal, async (open) => {
  if (open) {
    await nextTick()
    if (editorRef.value) {
      quillInstance = new $quill(editorRef.value, {
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
      // set konten awal
      quillInstance.root.innerHTML = form.value.content
      // sinkronisasi onchange
      quillInstance.on('text-change', () => {
        form.value.content = quillInstance.root.innerHTML
      })
    }
  } else {
    // opsi: destroy instance jika perlu
    quillInstance = null
  }
})

const handleFileUpload = (e) => {
  form.value.thumbnail = e.target.files[0] || null
}

const submitUpdate = async () => {
  isSubmitting.value = true
  updateError.value = null
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('content', form.value.content)
    if (form.value.thumbnail) {
      formData.append('thumbnail', form.value.thumbnail)
    }
    await updateNews(route.params.slug, formData)
    await fetchNewsBySlug(route.params.slug)
    showEditModal.value = false
  } catch (err) {
    updateError.value = err.message || 'Terjadi kesalahan saat mengupdate berita'
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(date)
}
</script>
