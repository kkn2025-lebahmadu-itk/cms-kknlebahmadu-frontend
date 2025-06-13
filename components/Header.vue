<script setup>
import { ref, computed } from 'vue'
import { useDarkMode } from '~/composables/useDarkMode'
import { useAuth } from '~/composables/useAuth'
import Swal from 'sweetalert2'

const token = useCookie('refresh_token')
const isLoggedIn = computed(() => !!token.value)
const menuOpen = ref(false)
const showAdminMenu = ref(false)

const { isDark, toggleDark } = useDarkMode()

// Change Password
const showChangePasswordModal = ref(false)
const isChangingPassword = ref(false)
const formChangePassword = ref({
  old_password: '',
  new_password: ''
})

const { changePassword } = useAuth()

const handleChangePassword = async () => {
  isChangingPassword.value = true
  try {
    const res = await changePassword(formChangePassword.value.old_password, formChangePassword.value.new_password)
    if (res.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Password berhasil diubah',
        confirmButtonColor: '#3085d6'
      })

      showChangePasswordModal.value = false
      // Reset form
      formChangePassword.value.old_password = ''
      formChangePassword.value.new_password = ''
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: res.message || 'Gagal mengubah password',
        confirmButtonColor: '#d33'
      })
    }
  } catch (err) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Terjadi kesalahan',
      confirmButtonColor: '#d33'
    })
  } finally {
    isChangingPassword.value = false
  }
}
</script>

<template>
  <header class="bg-KKNGreen dark:bg-green-900 text-white">
    <div class="mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="text-2xl font-bold">
        Sistem Informasi RT 45 Telaga Sari
      </NuxtLink>

      <!-- Dark Mode + Hamburger (Mobile Only) -->
      <div class="flex items-center gap-2 md:hidden">
        <button @click="toggleDark" class="p-2 rounded-lg"
          :class="isDark ? 'bg-KKNWhite text-KKNBlack' : 'bg-KKNBlack text-KKNWhite'">
          <Moon v-if="isDark" />
          <Sun v-else />
        </button>
        <button class="focus:outline-none" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Navigation (Desktop) -->
      <nav class="hidden md:flex items-center space-x-4 text-sm md:text-base">
        <button @click="toggleDark" class="p-2 rounded-lg"
          :class="isDark ? 'bg-KKNWhite text-KKNBlack' : 'bg-KKNBlack text-KKNWhite'">
          <Moon v-if="isDark" />
          <Sun v-else />
        </button>

        <NuxtLink to="/" class="hover:underline">Beranda</NuxtLink>
        <NuxtLink to="/berita" class="hover:underline">Berita</NuxtLink>
        <NuxtLink to="/galeri" class="hover:underline">Galeri</NuxtLink>
        <template v-if="isLoggedIn">
          <div class="relative">
            <button @click="showAdminMenu = !showAdminMenu" class="hover:underline focus:outline-none">
              <p v-if="!showAdminMenu">Menu Admin ⌄</p>
              <p v-if="showAdminMenu">Menu Admin ^</p>

            </button>
            <div v-if="showAdminMenu" @click="showAdminMenu = false" class="fixed inset-0 z-40"></div>

            <transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="showAdminMenu" class="absolute mt-2 right-0 bg-white text-black rounded shadow-lg z-50 w-52 py-2">
                <NuxtLink @click="showAdminMenu = false" to="/admin/berita" class="block px-4 py-2 hover:bg-gray-100">Manajemen Berita</NuxtLink>
                <NuxtLink @click="showAdminMenu = false" to="/admin/galeri" class="block px-4 py-2 hover:bg-gray-100">Manajemen Galeri</NuxtLink>
                <NuxtLink @click="showAdminMenu = false" to="/admin" class="block px-4 py-2 hover:bg-gray-100">Manajemen Admin</NuxtLink>
                <NuxtLink @click="showAdminMenu = false" to="/surat" class="block px-4 py-2 hover:bg-gray-100">Surat</NuxtLink>
                <NuxtLink @click="showAdminMenu = false" to="/aspiration" class="block px-4 py-2 hover:bg-gray-100">Aspiration</NuxtLink>
                <NuxtLink @click="showAdminMenu = false" to="/manage-profile" class="block px-4 py-2 hover:bg-gray-100">Manage Profile</NuxtLink>
                <!-- Tambahkan Ganti Password -->
                <NuxtLink @click="showAdminMenu = false; showChangePasswordModal = true" class="block px-4 py-2 hover:bg-gray-100">Ganti Password</NuxtLink>
                <NuxtLink @click="showAdminMenu = false" to="/auth/logout" class="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</NuxtLink>
              </div>
            </transition>
          </div>
        </template>

        <template v-else>
          <NuxtLink to="/auth/login" class="hover:underline">Login</NuxtLink>
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
        <NuxtLink to="/" class="block hover:underline" @click="menuOpen = false">Beranda</NuxtLink>
        <NuxtLink to="/berita" class="block hover:underline" @click="menuOpen = false">Berita</NuxtLink>
        <NuxtLink to="/galeri" class="block hover:underline" @click="menuOpen = false">Galeri</NuxtLink>

        <template v-if="isLoggedIn">
          <NuxtLink to="/admin" class="block hover:underline" @click="menuOpen = false">Rekap</NuxtLink>
          <NuxtLink to="/admin/galeri" class="block hover:underline" @click="menuOpen = false">Manajemen Galeri</NuxtLink>
          <NuxtLink to="/surat" class="block hover:underline" @click="menuOpen = false">Surat</NuxtLink>
          <NuxtLink to="/aspiration" class="block hover:underline" @click="menuOpen = false">Aspiration</NuxtLink>
          <NuxtLink to="/manage-profile" class="block hover:underline" @click="menuOpen = false">Manage Profile</NuxtLink>
          <!-- Tambahkan Ganti Password di Mobile -->
          <NuxtLink @click="menuOpen = false; showChangePasswordModal = true" class="block hover:underline">Ganti Password</NuxtLink>
          <NuxtLink to="/auth/logout" class="block hover:underline text-red-400" @click="menuOpen = false">Logout</NuxtLink>
        </template>

        <template v-else>
          <NuxtLink to="/auth/login" class="block hover:underline" @click="menuOpen = false">Login</NuxtLink>
        </template>
      </div>
    </transition>

    <!-- Change Password Modal -->
    <div v-show="showChangePasswordModal" @click.self="showChangePasswordModal = false" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-KKNBlack rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold dark:text-white">Ganti Password</h2>
          <button @click="showChangePasswordModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            &times;
          </button>
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Password Lama</label>
            <input v-model="formChangePassword.old_password" type="password" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-KKNBlack text-black dark:text-white" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Password Baru</label>
            <input v-model="formChangePassword.new_password" type="password" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-KKNBlack text-black dark:text-white" required>
          </div>

          <div class="flex justify-end pt-4">
            <button type="button" @click="showChangePasswordModal = false" class="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              Batal
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700" :disabled="isChangingPassword">
              {{ isChangingPassword ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </header>
</template>
