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

    <!-- Tabel User dan Admin -->
    <div class="overflow-x-auto">
      <table class="w-full bg-white dark:bg-stone-800 shadow rounded border">
        <thead class="bg-gray-100 dark:bg-stone-900 text-left">
          <tr>
            <th class="px-4 py-2 border">ID</th>
            <th class="px-4 py-2 border">Username</th>
            <th class="px-4 py-2 border">Role</th>
            <th class="px-4 py-2 border text-center ">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in response?.users || []"
            :key="user.id"
            class="hover:bg-gray-50 dark:hover:bg-stone-700 transition duration-200"
          >
            <td class="px-4 py-2 border">{{ user.id }}</td>
            <td class="px-4 py-2 border">{{ user.username }}</td>
            <td class="px-4 py-2 border capitalize">{{ user.role }}</td>
            <td class="px-4 py-2 border text-center flex items-center justify-center">
              <button
                v-if="user.role === 'user'"
                @click="assign(user.id)"
                :disabled="isActionPending"
                class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center space-x-2"
              >
                <span v-if="isActionPending && selectedUserId === user.id">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </span>
                <span>Jadikan Admin</span>
              </button>

              <button
                v-else-if="user.role === 'admin'"
                @click="revoke(user.id)"
                :disabled="isActionPending"
                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center space-x-2"
              >
                <span v-if="isActionPending && selectedUserId === user.id">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </span>
                <span>Turunkan Admin</span>
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
import Swal from 'sweetalert2'

const {
  fetchAllAdmin,
  createAdmin,
  deleteAdmin,
  response,
  pending,
  error
} = useAdminManagement()

const isActionPending = ref(false)
const selectedUserId = ref(null)

const assign = async (id) => {
  isActionPending.value = true
  selectedUserId.value = id

  try {
    await createAdmin(id)
    await Swal.fire('Berhasil', 'Berhasil menjadikan admin.', 'success')
    await fetchAllAdmin()
  } catch (err) {
    await Swal.fire('Error', err?.message || 'Gagal menjadikan admin.', 'error')
  } finally {
    isActionPending.value = false
    selectedUserId.value = null
  }
}

const revoke = async (id) => {
  const result = await Swal.fire({
    title: 'Yakin ingin menurunkan admin ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, turunkan',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    isActionPending.value = true
    selectedUserId.value = id

    try {
      await deleteAdmin(id)
      await Swal.fire('Berhasil', 'Berhasil menurunkan admin.', 'success')
      await fetchAllAdmin()
    } catch (err) {
      await Swal.fire('Error', err?.message || 'Gagal menurunkan admin.', 'error')
    } finally {
      isActionPending.value = false
      selectedUserId.value = null
    }
  }
}

onMounted(fetchAllAdmin)
</script>
