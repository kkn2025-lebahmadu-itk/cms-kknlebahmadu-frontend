<template>
    <div class="min-h-screen flex bg-gray-100">
      <!-- Sidebar -->
      <aside
        class="fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:static md:translate-x-0"
        :class="{ '-translate-x-full': !sidebarOpen }"
      >
        <div class="p-4 border-b flex justify-between items-center md:hidden">
          <span class="font-semibold text-lg">Menu</span>
          <button @click="sidebarOpen = false">
            <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" stroke-width="2"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="hidden md:flex items-center justify-center p-4 border-b">
          <h2 class="text-xl font-bold text-blue-600">Admin Panel</h2>
        </div>
        <nav class="p-4 space-y-2">
          <NuxtLink
            to="/admin/berita"
            class="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
            active-class="bg-blue-500 text-white"
          >
            📰 Berita
          </NuxtLink>
          <NuxtLink
            to="/admin/users"
            class="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
            active-class="bg-blue-500 text-white"
          >
            👥 Pengguna
          </NuxtLink>
          <NuxtLink
            to="/admin/settings"
            class="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
            active-class="bg-blue-500 text-white"
          >
            ⚙️ Pengaturan
          </NuxtLink>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-screen">
        <!-- Topbar -->
        <header class="bg-white shadow px-4 py-3 flex justify-between items-center md:pl-8">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="text-gray-500 hover:text-gray-800 focus:outline-none md:hidden"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h1 class="text-lg font-bold text-gray-800">Admin Dashboard</h1>
        </header>
  
        <!-- Page Content -->
        <main class="p-6">
          <slot />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const sidebarOpen = ref(false)
  </script>
  