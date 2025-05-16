<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useNews } from '~/composables/useNews'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

const { createNews } = useNews()
const router = useRouter()

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

onMounted(() => {
  if (editorRef.value) {
    // quillInstance = new $quill(editorRef.value, {
    //   theme: 'snow',
    //   placeholder: 'Tulis berita di sini...',
    //   modules: {
    //     toolbar: [
    //       [{ header: [1, 2, false] }],
    //       ['bold', 'italic', 'underline'],
    //       ['link', 'blockquote', 'code-block', 'image'],
    //       [{ list: 'ordered' }, { list: 'bullet' }]
    //     ]
    //   }
    // })
    quillInstance = new $quill(editorRef.value, {
  theme: 'snow',
  placeholder: 'Tulis berita di sini...',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'blockquote', 'code-block', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }] // Tambahkan ini untuk alignment
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
    alert('Judul dan isi berita wajib diisi.')
    return
  }

  const formData = new FormData()
  formData.append('title', form.title)
  formData.append('content', form.content)

  if (form.thumbnailFile) {
    formData.append('thumbnail', form.thumbnailFile)
  }

  try {
    console.log('Form data:', formData)
    await createNews(formData)
    alert('Berita berhasil dibuat!')
    router.push('/berita')
  } catch (err) {
    console.error('Gagal membuat berita:', err)
    alert('Gagal membuat berita.')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded shadow">
    <!-- Judul Berita -->
    <div>
      <label class="block mb-1 font-semibold">Judul Berita</label>
      <input
        v-model="form.title"
        type="text"
        class="w-full p-2 border rounded"
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
        class="bg-white rounded shadow min-h-[200px] p-4"
      ></div>
    </div>

    <!-- Tombol Submit -->
    <button
      type="submit"
      class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Simpan
    </button>
  </form>
</template>
