<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="handleLogin" class="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Login</h2>
      
      <div>
        <label class="block text-gray-700 mb-2">Email:</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-2">Password:</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition"
      >
        Login
      </button>

      <p class="text-center text-sm text-gray-600">
        Belum punya akun?
        <a href="/auth/register" class="text-blue-500 hover:underline">Daftar di sini</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import login from '../../services/auth/login.js'
const email = ref('')
const password = ref('')
const { login } = useAuth()

const handleLogin = async () => {
  const result = await login(email.value, password.value)
  if (!result.success) {
    console.log(result)
  } else {
    const accessToken = useCookie('access_token')
    const refreshToken = useCookie('refresh_token')

    accessToken.value = result.data.access
    refreshToken.value = result.data.refresh
    navigateTo('/')
  }
}
</script>
