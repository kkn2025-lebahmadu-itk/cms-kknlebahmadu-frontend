<template>
  <div
    @click="goToDetail(slug)"
    class="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition flex flex-col overflow-hidden"
  >
    <!-- WRAPPER GAMBAR -->
    <div v-if="thumbnail" class="w-full h-[40dvh] flex items-center justify-center bg-gray-100 overflow-hidden">
      <img
        v-if="thumbnail"
        :src="thumbnail"
        :alt="title"
        class="max-w-full max-h-full object-contain"
      />
    </div>

    <!-- KONTEN & TOMBOL -->
    <div class="p-4 flex flex-col flex-1">
      <div class="flex-1 overflow-auto max-h-[40vh]">
        <h2 class="text-xl font-semibold mb-2">{{ title }}</h2>
        <article class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none mb-4">
          <div v-html="content"></div>
        </article>
      </div>
      <div class="flex space-x-2 mt-2">
        <button
          @click.stop="goToDetail"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Detail
        </button>
        <button
          v-if="isLoggedIn"
          @click.stop="$emit('delete', slug)"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
  title: String,
  content: String,
  slug: String,
  thumbnail: String,
  isLoggedIn: Boolean
})
defineEmits(['delete'])

function goToDetail(slug) {
  router.push(`/berita/${slug}`)
}
</script>
