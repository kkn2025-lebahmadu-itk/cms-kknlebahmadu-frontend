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
    <button type="submit">Register</button>
  </form>
</template>

<script setup>
import register from '../../services/auth/register.js'
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')


const handleRegister = async () => {
	console.log(username.value, email.value, password.value)
  const result = await register(username.value, email.value, password.value)
  if (!result.success) {
		console.log(result)
  } else {
		console.log(result)
    navigateTo('/')
  }
}

</script>