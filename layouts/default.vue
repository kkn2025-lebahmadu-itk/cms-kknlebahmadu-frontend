<script setup>
import { useDarkMode } from '~/composables/useDarkMode'
const { isDark } = useDarkMode()
</script>

<template>
  <!-- Tambahkan class dinamis "dark" di root -->
  <div :class="{ dark: isDark }">
    <Header />
    <div class="bg-white text-black dark:bg-KKNBlack dark:text-white min-h-screen flex flex-col justify-between transition-colors duration-300">
      <main class="flex-grow">
        <NuxtPage />
      </main>
      <Footer />
    </div>
  </div>
</template>
