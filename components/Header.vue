<script setup>
const token = useCookie('refresh_token') // nama cookiemu

const isLoggedIn = computed(() => {
  return !!token.value
})
</script>

<template>
  <header class="bg-KKNGreen text-white">
    <div class="mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
      <div class="text-2xl font-bold mb-2 md:mb-0 text-center md:text-left">
        Sistem Informasi RT 45
      </div>

      <nav class="space-x-4 text-sm md:text-base">
        <NuxtLink href="/" class="hover:underline">Beranda</NuxtLink>
        <NuxtLink href="/berita" class="hover:underline">Berita</NuxtLink>
        <NuxtLink href="/galeri" class="hover:underline">Galeri</NuxtLink>


        <!-- <NuxtLink href="/kontak" class="hover:underline">Kontak</NuxtLink> -->

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
</template>
