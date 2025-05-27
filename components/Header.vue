
<script setup>
import { ref, computed } from 'vue'

const token = useCookie('refresh_token')

const isLoggedIn = computed(() => !!token.value)
const menuOpen = ref(false)
const showAdminMenu = ref(false)


import { useDarkMode } from '~/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()

</script>


<!-- <template>
  <header class="bg-KKNGreen text-white">
    <div class="mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
      <div class="text-2xl font-bold mb-2 md:mb-0 text-center md:text-left">
        Sistem Informasi RT 45
      </div>

      <nav class="space-x-4 text-sm md:text-base">
        <NuxtLink href="/" class="hover:underline">Beranda</NuxtLink>
        <NuxtLink href="/berita" class="hover:underline">Berita</NuxtLink>
        <NuxtLink href="/galeri" class="hover:underline">Galeri</NuxtLink>



        <template v-if="isLoggedIn">
					<NuxtLink href="/admin" class="hover:underline">Rekap</NuxtLink>
					<NuxtLink href="/surat" class="hover:underline">Surat</NuxtLink>
					<NuxtLink href="/aspiration" class="hover:underline">Aspiration</NuxtLink>
          <NuxtLink href="/manage-profile" class="hover:underline">Manage Profile</NuxtLink>
          <NuxtLink href="/auth/logout" class="hover:underline">Logout</NuxtLink>
          <NuxtLink href="/admin" class="hover:underline">Admin</NuxtLink>

        </template>
        <template v-else>
          <NuxtLink href="/auth/login" class="hover:underline">Login</NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template> -->
<template>
  <header class="bg-KKNGreen text-white">
    <div class="mx-auto px-4 py-4 flex items-center justify-between">
      <div class="text-2xl font-bold">Sistem Informasi RT 45</div>

    <!-- Hamburger Button (mobile) -->
<button
  class="md:hidden focus:outline-none"
  @click="menuOpen = !menuOpen"
  aria-label="Toggle menu"
>
  
</button>


      <!-- Navigation (Desktop) -->
      <nav class="hidden md:flex items-center space-x-4 text-sm md:text-base">
        <button class="bg-KKNWhite text-KKNBlack p-2 rounded-lg" v-if="isDark" @click="toggleDark">
        <Moon/>
      </button>
      <button class="text-KKNWhite bg-KKNBlack p-2 rounded-lg" v-if="!isDark" @click="toggleDark">
        <Sun/>
      </button>
  <NuxtLink href="/" class="hover:underline">Beranda</NuxtLink>
  <NuxtLink href="/galeri" class="hover:underline">Galeri</NuxtLink>



  <template v-if="isLoggedIn">
    <!-- Toggle admin menu -->
     
     
    <div  class="relative">
      <button
        @click="showAdminMenu = !showAdminMenu"
        class="hover:underline focus:outline-none"
      >
        Menu Admin ⌄
      </button>
      <div v-if="showAdminMenu" @click="showAdminMenu = !showAdminMenu" class="fixed top-0 right-0  w-screen h-screen z-40"></div>

      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="showAdminMenu"
          class="absolute mt-2 right-0 bg-white text-black rounded shadow-lg z-50 w-52 py-2"
        >  <NuxtLink         @click="showAdminMenu = !showAdminMenu" href="/berita" class="block px-4 py-2 hover:bg-gray-100">Berita</NuxtLink>
        <NuxtLink @click="showAdminMenu = !showAdminMenu" href="/admin/galeri" class="block px-4 py-2 hover:bg-gray-100">Manajemen Galeri</NuxtLink>
          <NuxtLink @click="showAdminMenu = !showAdminMenu" href="/admin" class="block px-4 py-2 hover:bg-gray-100">Manajemen Admin</NuxtLink>
          <NuxtLink @click="showAdminMenu = !showAdminMenu" href="/surat" class="block px-4 py-2 hover:bg-gray-100">Surat</NuxtLink>
          <NuxtLink @click="showAdminMenu = !showAdminMenu" href="/aspiration" class="block px-4 py-2 hover:bg-gray-100">Aspiration</NuxtLink>
          <NuxtLink @click="showAdminMenu = !showAdminMenu" href="/manage-profile" class="block px-4 py-2 hover:bg-gray-100">Manage Profile</NuxtLink>
          <NuxtLink @click="showAdminMenu = !showAdminMenu" href="/auth/logout" class="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</NuxtLink>

        </div>
      </transition>
    </div>
  </template>

  <template v-else>
    <NuxtLink href="/auth/login" class="hover:underline">Login</NuxtLink>
  </template>
</nav>

    </div>

   <!-- Mobile Menu -->
<transition
  enter-active-class="transition duration-300 ease-out"
  enter-from-class="opacity-0 -translate-y-4"
  enter-to-class="opacity-100 translate-y-0"
  leave-active-class="transition duration-200 ease-in"
  leave-from-class="opacity-100 translate-y-0"
  leave-to-class="opacity-0 -translate-y-4"
>
  <div v-if="menuOpen" class="md:hidden px-4 pb-4 space-y-2 text-sm">
    <NuxtLink href="/" class="block hover:underline" @click="menuOpen = false">Beranda</NuxtLink>
    <NuxtLink href="/berita" class="block hover:underline" @click="menuOpen = false">Berita</NuxtLink>
    <NuxtLink href="/galeri" class="block hover:underline" @click="menuOpen = false">Galeri</NuxtLink>

    <template v-if="isLoggedIn">
      <NuxtLink href="/admin" class="block hover:underline" @click="menuOpen = false">Rekap</NuxtLink>
    <NuxtLink href="/admin/galeri" class="block hover:underline" @click="menuOpen = false">Manajemen Galeri</NuxtLink>

      <NuxtLink href="/surat" class="block hover:underline" @click="menuOpen = false">Surat</NuxtLink>
      <NuxtLink href="/aspiration" class="block hover:underline" @click="menuOpen = false">Aspiration</NuxtLink>
      <NuxtLink href="/manage-profile" class="block hover:underline" @click="menuOpen = false">Manage Profile</NuxtLink>
      <NuxtLink href="/auth/logout" class="block hover:underline" @click="menuOpen = false">Logout</NuxtLink>
    </template>
    <template v-else>
      <NuxtLink href="/auth/login" class="block hover:underline" @click="menuOpen = false">Login</NuxtLink>
    </template>
  </div>
</transition>

  </header>
</template>

