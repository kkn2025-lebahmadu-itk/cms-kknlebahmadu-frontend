<template>
  <form @submit.prevent="handleRegister">
    <div>
			<label>Nama Lengkap:</label>
			<input v-model="username" type="text" required />
    </div>
    <div>
      <label>Email:</label>
      <input v-model="email" type="email" required />
    </div>
    <div>
      <label>Password:</label>
      <input v-model="password" type="password" required />
    </div>
		<div>
      <label>Confirm Password:</label>
      <input v-model="confirm_password" type="password" required />
    </div>
    <button type="submit">Register</button>
  </form>
	<p>Sudah punya akun ? <a href="/auth/login">Login</a></p>
</template>

<script setup>
// import register from '../../services/auth/register.js'
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const confirm_password = ref('')
const {register} = useAuth()


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

</script>