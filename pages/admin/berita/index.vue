<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">News</h1>
    <NuxtLink
        to="/berita/create"
        class="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add News
      </NuxtLink>
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ error }}</span>
    </div>
    

    <div v-else-if="paginatedNews.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    
      <NewsCard
        v-for="item in paginatedNews"
        :key="item.id"
        :title="item.title"
        :content="item.content"
        :slug="item.slug"
        :thumbnail="item.thumbnail_url"
        @delete="confirmDelete"
      />
    </div>

    
    <Pagination
      v-if="response && response.data && response.data.length > postsPerPage"
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
import { ref, computed, onMounted } from 'vue'
import NewsCard from '~/components/News/NewsCard.vue'
import Pagination from '~/components/News/Pagination.vue'

const { response, pending, error, fetchAllNews, deleteNews } = useNews()

const postsPerPage = 10
const currentPage = ref(1)

const paginatedNews = computed(() => {
  if (!response.value || !response.value.data) return []
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return response.value.data.slice(start, end)
})

const totalPages = computed(() => {
  if (!response.value || !response.value.data) return 1
  return Math.ceil(response.value.data.length / postsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

const confirmDelete = async (slug) => {
  if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
    await deleteNews(slug)
    
    if (!error.value) {
      await fetchAllNews()
      alert('Berita berhasil dihapus')
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value
      }
    }
  }
}

onMounted(async () => {
  await fetchAllNews()
})


definePageMeta({
 layout: 'admin',
})
</script>
