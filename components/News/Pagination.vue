<template>
    <div class="flex justify-center mt-8 space-x-2">
      <button
        @click="$emit('prev')"
        :disabled="currentPage === 1"
        class="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        Prev
      </button>
  
      <button
        v-for="page in totalPages"
        :key="page"
        @click="$emit('go', page)"
        :class="[
          'px-3 py-2 rounded',
          currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
        ]"
      >
        {{ page }}
      </button>
  
      <button
        @click="$emit('next')"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
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
  