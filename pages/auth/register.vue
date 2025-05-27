<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="handleRegister" class="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Register</h2>

      <div>
        <label class="block text-gray-700 mb-2">Nama Lengkap:</label>
        <input
          v-model="username"
          type="text"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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

      <div>
        <label class="block text-gray-700 mb-2">Confirm Password:</label>
        <input
          v-model="confirm_password"
          type="password"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition"
      >
        Register
      </button>

      <p class="text-center text-sm text-gray-600">
        Sudah punya akun?
        <a href="/auth/login" class="text-blue-500 hover:underline">Login</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import register from '../../services/auth/register.js'

const username = ref('')
const email = ref('')
const password = ref('')
const confirm_password = ref('')
const { register } = useAuth()

const handleRegister = async () => {
  if (password.value !== confirm_password.value) {
    alert('Passwords do not match!')
    password.value = ''
    confirm_password.value = ''
    return
  }
  const result = await register(username.value, email.value, password.value)
  if (!result.success) {
    console.log(result)
  } else {
    navigateTo('/')
  }
}




definePageMeta({
  layout: 'none',
})
</script>
