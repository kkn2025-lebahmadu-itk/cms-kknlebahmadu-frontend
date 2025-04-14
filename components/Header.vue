<template>
    <header class="bg-KKNGreen text-white">
      <div class="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <!-- Judul Website -->
        <div class="text-2xl font-bold mb-2 md:mb-0 text-center md:text-left">
          Sistem Informasi RT 45
        </div>
  
        <!-- Navigasi -->
        <nav class="space-x-4 text-sm md:text-base">
          <NuxtLink href="/" class="hover:underline">Beranda</NuxtLink>
          <NuxtLink href="/berita" class="hover:underline">Berita</NuxtLink>
          <NuxtLink href="/galeri" class="hover:underline">Galeri</NuxtLink>
          <NuxtLink href="/kontak" class="hover:underline">Kontak</NuxtLink>
        </nav>
      </div>
    </header>
  </template>
  