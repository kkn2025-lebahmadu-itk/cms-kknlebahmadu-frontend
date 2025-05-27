<template>
  <div class="flex justify-center mt-8 space-x-2">
    <button
      @click="$emit('prev')"
      :disabled="currentPage === 1"
      class="px-3 py-2 rounded disabled:opacity-50
             bg-KKNWhite text-KKNBlack hover:bg-gray-200
             dark:bg-KKNBlack dark:text-KKNWhite dark:hover:bg-gray-700"
    >
      Prev
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      @click="$emit('go', page)"
      :class="[
        'px-3 py-2 rounded',
        currentPage === page
          ? 'bg-blue-500 text-white dark:bg-blue-400 dark:text-KKNBlack'
          : 'bg-KKNWhite text-KKNBlack hover:bg-gray-200 dark:bg-KKNBlack dark:text-KKNWhite dark:hover:bg-gray-700'
      ]"
    >
      {{ page }}
    </button>

    <button
      @click="$emit('next')"
      :disabled="currentPage === totalPages"
      class="px-3 py-2 rounded disabled:opacity-50
             bg-KKNWhite text-KKNBlack hover:bg-gray-200
             dark:bg-KKNBlack dark:text-KKNWhite dark:hover:bg-gray-700"
    >
      Next
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number
})

defineEmits(['prev', 'next', 'go'])
</script>
