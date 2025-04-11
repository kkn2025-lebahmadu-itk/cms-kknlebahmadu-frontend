<template>
  <form @submit.prevent="handleLogin">
    <div>
      <label>Email:</label>
      <input v-model="email" type="email" required />
    </div>
    <div>
      <label>Password:</label>
      <input v-model="password" type="password" required />
    </div>
    <button type="submit">Login</button>
  </form>
  <p>Belum punya akun ? <a href="/auth/register">Daftar di sini</a></p>
</template>

<script setup>
import login from '../../services/auth/login.js'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

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