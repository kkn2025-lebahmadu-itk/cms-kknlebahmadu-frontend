<template>
  <section class="p-6 max-w-screen-2xl mx-auto bg-KKNwhite space-y-10">
    <h1 class="text-3xl font-bold">Galeri Foto</h1>

    <div v-if="pending" class="text-gray-600">🔄 Loading...</div>
    <div v-else-if="error" class="text-red-600">❌ Error: {{ error }}</div>

    <div class="container  bg-KKNWhite dark:bg-KKNBlack p-[15px] rounded-[20px] drop-shadow-md drop-shadow-KKNBlack" v-else>
      

          <!-- GALERI UMUM -->
    <div class="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-md mb-">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold">Foto Galeri Umum</h2>
        <button @click="openUploadModal" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition">
          + Upload Foto
        </button>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="item in galleryImages" :key="'gallery-' + item.id" class="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
          <div class="relative">
            <img :src="item.imagePath" :alt="item.caption" class="w-full h-48 object-cover" />
            <div class="absolute top-2 right-2 flex space-x-2">
              <button @click="showDetail(item)" class="bg-blue-500 p-1 rounded text-white hover:bg-blue-600">
                <span class="sr-only">Detail</span>
                🔍
              </button>
              <button v-if="isLoggedIn" @click="confirmDelete(item.id)" class="bg-red-500 p-1 rounded text-white hover:bg-red-600">
                <span class="sr-only">Hapus</span>
                🗑
              </button>
            </div>
          </div>
          <div class="p-2">
            <p class="text-sm truncate">{{ item.caption || 'No caption' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FOTO BERITA -->
    <div class="bg-white dark:bg-stone-900 p-4 mt-5 rounded-2xl shadow-md">
      <h2 class="text-2xl font-semibold mb-4">Foto dari Berita</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="item in newsImages" :key="'news-' + item.id" class="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
          <div class="relative">
            <img :src="item.imagePath" :alt="item.title" class="w-full h-48 object-cover" />
            <div class="absolute top-2 right-2">
              <button @click="showDetail(item)" class="bg-blue-500 p-1 rounded text-white hover:bg-blue-600">
                🔍
              </button>
            </div>
          </div>
          <div class="p-2">
            <p class="text-sm font-semibold truncate">{{ item.title }}</p>
            <p class="text-xs text-gray-500">🖋 {{ item.poster?.username || 'Unknown' }}</p>
          </div>
        </div>
      </div>
    </div>
  

      
    </div>

    <!-- Detail Modal -->
    <div @click="isDetailModalOpen = false" v-if="isDetailModalOpen" class="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
      <div class="bg-white  dark:bg-stone-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Detail Foto</h3>
            <button @click="isDetailModalOpen = false" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          
          <div v-if="selectedItem">
            <img :src="selectedItem.imagePath" :alt="selectedItem.caption" class="w-full h-auto mb-4 rounded" />
            
            <p v-if="selectedItem.type === 'news'" class="text-gray-700 mb-2">
              <strong>Judul Berita:</strong> {{ selectedItem.title }}
            </p>
            <div v-html="selectedItem.caption" class="text-gray-700 mb-2"></div>

            <p v-if="selectedItem.type === 'news'" class="text-gray-700 mb-2">
              <strong>Ditulis oleh:</strong> {{ selectedItem.poster?.username || 'Unknown' }}
            </p>
            <p class="text-sm text-gray-500" v-if="selectedItem.created_at">
              {{ new Date(selectedItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <h3 class="text-xl font-bold mb-4">Konfirmasi Hapus</h3>
          <p class="mb-6">Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan.</p>
          <div class="flex justify-end gap-3">
            <button @click="isDeleteModalOpen = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Batal
            </button>
            <button @click="deleteItem" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="isUploadModalOpen" @click.self="closeUploadModal" class="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4 opacity-100">
      <div class="bg-white  dark:bg-stone-900 rounded-lg max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Upload Foto</h3>
            <button @click="isUploadModalOpen = false" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">&times;</span>
            </button>
          </div>

          <form @submit.prevent="handleUpload" class="space-y-4">
            <div>
              <label class="block mb-1 font-medium">Foto</label>
              <input 
                type="file" 
                @change="handleFileChange" 
                accept="image/*"
                class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div v-if="previewUrl" class="mt-2">
                <img :src="previewUrl" class="h-40 object-contain" />
              </div>
            </div>
<!-- 
            <div>
              <label class="block mb-1 font-medium">Keterangan</label>
              <textarea
                v-model="uploadForm.caption"
                rows="3"
                class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Keterangan foto"
              ></textarea>
            </div> -->

            <div>
              <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-50"
                :disabled="uploading"
              >
                {{ uploading ? 'Mengunggah...' : 'Upload' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<!-- <script setup>
import { ref, reactive, onMounted } from 'vue'
import { useGallery } from '~/composables/useGallery'


const token = useCookie('refresh_token') // nama cookiemu

const isLoggedIn = computed(() => {
  return !!token.value
})
const {
  fetchAllPicture,
  uploadPicture,
  deletePicture,
  response,
  pending,
  error
} = useGallery()

const allImages       = ref([])
const selectedItem    = ref(null)
const selectedId      = ref(null)
const isDetailModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isUploadModalOpen = ref(false)
const uploading       = ref(false)
const previewUrl      = ref(null)

const closeUploadModal = () => {
  isUploadModalOpen.value = false
}

const uploadForm = reactive({
  path: null
})

const processApiResponse = (data) => {
  const images = []
  if (data.gallery_images) {
    data.gallery_images.forEach(img => {
      images.push({
        id:        img.id,
        type:      'gallery',
        imagePath: img.path,
        caption:   img.caption || null,
        created_at: img.created_at
      })
    })
  }
  if (data.news_images) {
    data.news_images.forEach(news => {
      images.push({
        id:        news.id,
        type:      'news',
        imagePath: news.thumbnail,
        title:     news.title,
        caption:   news.content,
        slug:      news.slug,
        poster:    news.poster,
        created_at: news.created_at
      })
    })
  }
  return images
}

onMounted(async () => {
  await fetchAllPicture()
  if (response.value?.data) {
    allImages.value = processApiResponse(response.value.data)
  }
})

const showDetail = (item) => {
  selectedItem.value = item
  isDetailModalOpen.value = true
}

const confirmDelete = (id) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const deleteItem = async () => {
  await deletePicture(selectedId.value)
  if (!error.value) {
    await fetchAllPicture()
    if (response.value?.data) {
      allImages.value = processApiResponse(response.value.data)
    }
    isDeleteModalOpen.value = false
  }
}

const openUploadModal = () => {

  uploadForm.path = null
  uploadForm.caption = ''
  previewUrl.value = null
  isUploadModalOpen.value = true
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    uploadForm.path = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const galleryImages = computed(() => allImages.value.filter(img => img.type === 'gallery'))
const newsImages = computed(() => allImages.value.filter(img => img.type === 'news'))

const handleUpload = async () => {
  if (!uploadForm.path) {
    alert('Pilih file foto terlebih dahulu')
    return
  }
  uploading.value = true
  const formData = new FormData()
  formData.append('path', uploadForm.path)
  // formData.append('caption', uploadForm.caption)

  try {
    await uploadPicture(formData)
    if (!error.value) {
      await fetchAllPicture()
      if (response.value?.data) {
        allImages.value = processApiResponse(response.value.data)
      }
      isUploadModalOpen.value = false
    }
  } finally {
    uploading.value = false
  }
}
</script> -->

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useGallery } from '~/composables/useGallery'
import Swal from 'sweetalert2'

const token = useCookie('refresh_token')
const isLoggedIn = computed(() => !!token.value)

const {
  fetchAllPicture,
  uploadPicture,
  deletePicture,
  response,
  pending,
  error
} = useGallery()

const allImages       = ref([])
const selectedItem    = ref(null)
const isDetailModalOpen = ref(false)
const isUploadModalOpen = ref(false)
const uploading       = ref(false)
const previewUrl      = ref(null)

const uploadForm = reactive({
  path: null
})

const processApiResponse = (data) => {
  const images = []
  if (data.gallery_images) {
    data.gallery_images.forEach(img => {
      images.push({
        id:        img.id,
        type:      'gallery',
        imagePath: img.path,
        caption:   img.caption || null,
        created_at: img.created_at
      })
    })
  }
  if (data.news_images) {
    data.news_images.forEach(news => {
      images.push({
        id:        news.id,
        type:      'news',
        imagePath: news.thumbnail,
        title:     news.title,
        caption:   news.content,
        slug:      news.slug,
        poster:    news.poster,
        created_at: news.created_at
      })
    })
  }
  return images
}

onMounted(async () => {
  await fetchAllPicture()
  if (response.value?.data) {
    allImages.value = processApiResponse(response.value.data)
  }
})

const showDetail = (item) => {
  selectedItem.value = item
  isDetailModalOpen.value = true
}

const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Tindakan ini tidak dapat dibatalkan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    await deletePicture(id)
    if (!error.value) {
      await fetchAllPicture()
      if (response.value?.data) {
        allImages.value = processApiResponse(response.value.data)
      }
      await Swal.fire('Berhasil', 'Foto telah dihapus.', 'success')
    } else {
      await Swal.fire('Gagal', error.value, 'error')
    }
  }
}

const openUploadModal = () => {
  uploadForm.path = null
  previewUrl.value = null
  isUploadModalOpen.value = true
}

const closeUploadModal = () => {
  isUploadModalOpen.value = false
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    uploadForm.path = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const galleryImages = computed(() => allImages.value.filter(img => img.type === 'gallery'))
const newsImages = computed(() => allImages.value.filter(img => img.type === 'news'))

const handleUpload = async () => {
  if (!uploadForm.path) {
    await Swal.fire('Error', 'Pilih file foto terlebih dahulu', 'error')
    return
  }

  uploading.value = true
  const formData = new FormData()
  formData.append('path', uploadForm.path)

  try {
    await uploadPicture(formData)
    if (!error.value) {
      await fetchAllPicture()
      if (response.value?.data) {
        allImages.value = processApiResponse(response.value.data)
      }
      isUploadModalOpen.value = false
      await Swal.fire('Berhasil', 'Foto berhasil diupload.', 'success')
    } else {
      await Swal.fire('Gagal', error.value, 'error')
    }
  } catch (err) {
    await Swal.fire('Error', err.message || 'Terjadi kesalahan saat upload', 'error')
  } finally {
    uploading.value = false
  }
}
</script>
