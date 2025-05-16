<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">News</h1>
    <NuxtLink v-if="isLoggedIn"
      to="/berita/create"
      class="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Add News
    </NuxtLink>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- News List -->
    <!-- <div v-else-if="newsList.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NewsCard
        v-for="item in newsList"
        :key="item.id"
        :title="item.title"
        :content="item.content"
        :slug="item.slug"
        :thumbnail="item.thumbnail_url"
        @delete="confirmDelete"
      />
    </div> -->
<div class="container mx-auto p-0">
    <div class="grid grid-cols-1 gap-4">
      <NewsCard
        v-for="news in newsList"
        :key="news.slug"
        :title="news.title"
        :content="news.content"
        :slug="news.slug"
        :thumbnail="news.thumbnail_url"
        :is-logged-in="isLoggedIn"
        @delete="confirmDelete"
      />


    </div>
  </div>



    <!-- Pagination -->
    <Pagination
      v-if="totalPages > 1"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @prev="prevPage"
      @next="nextPage"
      @go="goToPage"
    />

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Last Page</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NewsCard from '~/components/News/NewsCard.vue'
import Pagination from '~/components/News/Pagination.vue'

const refreshToken = useCookie('refresh_token')
const isLoggedIn = computed(() => {
  return !!refreshToken.value
})

const { response, pending, error, fetchNewsByPage, deleteNews } = useNews()

const currentPage = ref(1)
const postsPerPage = 3

// Ambil list berita dari response
const newsList = computed(() => {
  return response.value?.results?.data || []
})

// Hitung total halaman
const totalPages = computed(() => {
  const count = response.value?.count || 0
  return Math.ceil(count / postsPerPage)
})

// Navigasi halaman
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const goToPage = (page) => {
  currentPage.value = page
}

// Delete dan refresh
const confirmDelete = async (slug) => {
  if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
    await deleteNews(slug)
    if (!error.value) {
      await fetchNewsByPage(currentPage.value)
      alert('Berita berhasil dihapus')
    }
  }
}

// Fetch saat awal dan saat currentPage berubah
const loadNews = async () => {
  await fetchNewsByPage(currentPage.value)
}

onMounted(loadNews)

watch(currentPage, loadNews)
</script>
