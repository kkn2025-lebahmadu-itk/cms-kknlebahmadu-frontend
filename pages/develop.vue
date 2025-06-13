<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200 text-center p-4 animate-fadeIn">
      <div class="animate-bounce mb-4 text-6xl">🚧</div>
      <h1 class="text-5xl font-extrabold text-gray-800 mb-4 animate-pulse">Under Development</h1>
      <p class="text-lg text-gray-700 mb-8 animate-fadeInDelay">
        We're working hard to bring this page to life. Hang tight!
      </p>
  
      <div class="flex items-center space-x-2 mb-6">
        <div class="w-4 h-4 bg-orange-400 rounded-full animate-bounce delay-100"></div>
        <div class="w-4 h-4 bg-orange-500 rounded-full animate-bounce delay-200"></div>
        <div class="w-4 h-4 bg-orange-600 rounded-full animate-bounce delay-300"></div>
      </div>
  
      <p class="text-sm text-gray-600 mb-2">Redirecting in {{ countdown }} seconds...</p>
  
      <button
        @click="goHome"
        class="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300 shadow-lg"
      >
        Go to Home Now
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const countdown = ref(5)
  let intervalId = null
  
  const goHome = () => {
    if (intervalId) clearInterval(intervalId)
    router.push('/')
  }
  
  onMounted(() => {
    intervalId = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(intervalId)
        router.push('/')
      }
    }, 1000)
  })
  
  onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
  })
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInDelay {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 1s ease-out forwards;
  }
  
  .animate-fadeInDelay {
    animation: fadeInDelay 1.5s ease-out forwards;
  }
  
  .animate-bounce {
    animation: bounce 1s infinite;
  }
  
  .delay-100 {
    animation-delay: 0.1s;
  }
  
  .delay-200 {
    animation-delay: 0.2s;
  }
  
  .delay-300 {
    animation-delay: 0.3s;
  }
  </style>
  