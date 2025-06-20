<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useNews } from '~/composables/useNews'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

const { createNews } = useNews()
const router = useRouter()

// Loading state
const isSubmitting = ref(false)

// Form state
const form = reactive({
  title: '',
  content: '',
  thumbnailFile: null, // File object
  thumbnailPreview: '' // base64 image preview
})

// Ref untuk Quill editor dan input file
const editorRef = ref(null)
const fileInputRef = ref(null)

let quillInstance = null
const { $quill } = useNuxtApp()

onMounted(async () => {
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

    quillInstance.on('text-change', () => {
      form.content = quillInstance.root.innerHTML
    })
  }
})

const handleThumbnailUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    form.thumbnailFile = file

    const reader = new FileReader()
    reader.onload = (e) => {
      form.thumbnailPreview = e.target?.result || ''
    }
    reader.readAsDataURL(file)
  }
}

const removeThumbnail = () => {
  form.thumbnailFile = null
  form.thumbnailPreview = ''

  // Reset input file supaya nama file hilang
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleSubmit = async () => {
  if (!form.title.trim() || !form.content.trim()) {
    await Swal.fire('Error', 'Judul dan isi berita wajib diisi.', 'error')
    return
  }
  if (!form.thumbnailFile) {
    await Swal.fire('Error', 'Thumbnail berita wajib diupload.', 'error')
    return
  }

  isSubmitting.value = true

  const formData = new FormData()
  formData.append('title', form.title)
  formData.append('content', form.content)

  if (form.thumbnailFile) {
    formData.append('thumbnail', form.thumbnailFile)
  }

  try {
    await createNews(formData)

    await Swal.fire('Berhasil', 'Berita berhasil dibuat!', 'success')
    router.push('/berita')

  } catch (err) {
    console.error('Gagal membuat berita:', err)
    await Swal.fire('Error', err?.response?.data?.message || err.message || 'Gagal membuat berita.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 bg-white dark:bg-KKNBlack p-6 rounded shadow">
    <!-- Judul Berita -->
    <div>
      <label class="block mb-1 font-semibold">Judul Berita</label>
      <input
        v-model="form.title"
        type="text"
        class="w-full p-2 border rounded bg-white dark:bg-KKNBlack text-black dark:text-white"
        placeholder="Judul berita..."
      />
    </div>

    <!-- Upload Thumbnail -->
    <div>
      <label class="block mb-1 font-semibold">Thumbnail</label>
      <input
        type="file"
        ref="fileInputRef"
        @change="handleThumbnailUpload"
        class="w-full p-2 border rounded"
        accept="image/*"
      />

      <div v-if="form.thumbnailPreview" class="mt-2 space-y-2">
        <img
          :src="form.thumbnailPreview"
          alt="Preview Thumbnail"
          class="max-w-xs rounded shadow"
        />
        <button
          type="button"
          @click="removeThumbnail"
          class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Hapus Thumbnail
        </button>
      </div>
    </div>

    <!-- Isi Berita -->
    <div>
      <label class="block mb-1 font-semibold">Isi Berita</label>
      <div
        ref="editorRef"
        class="bg-white dark:bg-KKNBlack rounded shadow min-h-[200px] p-4"
      ></div>
    </div>

    <!-- Tombol Submit -->
    <button
      type="submit"
      :disabled="isSubmitting"
      class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center space-x-2"
    >
      <span v-if="isSubmitting">
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </span>
      <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}</span>
    </button>
  </form>
</template>
