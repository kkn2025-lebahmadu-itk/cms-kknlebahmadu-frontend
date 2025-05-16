<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Manajemen Admin</h1>
  
      <!-- Loading -->
      <div v-if="pending" class="text-center py-8">
        <div class="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
  
      <!-- Error -->
      <div v-else-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>
  
      <!-- Success / Action Message -->
      <div v-if="actionMessage" :class="actionSuccess ? 'text-green-600' : 'text-red-600'" class="mb-4 font-medium">
        {{ actionMessage }}
      </div>
  
      <!-- Tabel User dan Admin -->
      <div class="overflow-x-auto">
        <table class="w-full bg-white shadow rounded border">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-4 py-2 border">ID</th>
              <th class="px-4 py-2 border">Username</th>
              <th class="px-4 py-2 border">Role</th>
              <th class="px-4 py-2 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in response?.users || []"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border">{{ user.id }}</td>
              <td class="px-4 py-2 border">{{ user.username }}</td>
              <td class="px-4 py-2 border capitalize">{{ user.role }}</td>
              <td class="px-4 py-2 border text-center">
                <button
                  v-if="user.role === 'user'"
                  @click="assign(user.id)"
                  class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Jadikan Admin
                </button>
                <button
                  v-else-if="user.role === 'admin'"
                  @click="revoke(user.id)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Turunkan Admin
                </button>
                <span v-else class="text-gray-500 italic">Tidak dapat diubah</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  <script setup>
import { ref, onMounted } from 'vue'
import { useAdminManagement } from '~/composables/useAdminManagement'

const {
  fetchAllAdmin,
  createAdmin,
  deleteAdmin,
  response,
  pending,
  error
} = useAdminManagement()

const actionMessage = ref('')
const actionSuccess = ref(false)

const assign = async (id) => {
  actionMessage.value = ''
  await createAdmin(id)
  if (!error.value) {
    actionMessage.value = "Berhasil menjadikan admin"
    actionSuccess.value = true
    await fetchAllAdmin()
    setTimeout(() => {
      actionMessage.value = ''
    }, 2000) // 3 detik
  } else {
    actionMessage.value = error.value
    actionSuccess.value = false
  }
}

const revoke = async (id) => {
  actionMessage.value = ''
  await deleteAdmin(id)
  if (!error.value) {
    actionMessage.value = "Berhasil menurunkan admin"
    actionSuccess.value = true
    await fetchAllAdmin()
    setTimeout(() => {
      actionMessage.value = ''
    }, 2000) // 3 detik
  } else {
    actionMessage.value = error.value
    actionSuccess.value = false
  }
}

onMounted(fetchAllAdmin)
</script>
