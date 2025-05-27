<template>
  <div class="max-w-4xl mx-auto p-6 space-y-10 text-KKNBlack dark:text-KKNWhite">
    <h1 class="text-3xl font-bold text-center">Manajemen Data Profil</h1>

    <!-- Form Tambah -->
    <form @submit.prevent="submitForm" class="bg-KKNWhite dark:bg-KKNBlack p-6 rounded shadow space-y-4">
      <h2 class="text-xl font-semibold">Tambah Data</h2>
      <input v-model="form.key" placeholder="Key" class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-KKNBlack dark:text-KKNWhite" required />
      <input v-model="form.value" placeholder="Value" class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-KKNBlack dark:text-KKNWhite" required />
      <select v-model="form.type" class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-KKNBlack dark:text-KKNWhite">
        <option value="inti">Inti</option>
        <option value="tambahan">Tambahan</option>
      </select>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
        Tambahkan
      </button>
      <p v-if="error" class="text-red-600 dark:text-red-400">{{ error }}</p>
    </form>

    <!-- List Data -->
    <div v-if="pending" class="text-gray-500 dark:text-gray-300 text-center">🔄 Loading...</div>

    <template v-else>
      <!-- INTI -->
      <section>
        <h2 class="text-xl font-semibold mb-4">🧩 Data Inti</h2>
        <div v-if="response.inti.length === 0" class="text-gray-500 dark:text-gray-300">Tidak ada data.</div>
        <div v-for="item in response.inti" :key="item.id" class="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-3 flex justify-between items-start">
          <div>
            <p><strong>Key:</strong> {{ item.key }}</p>
            <p><strong>Value:</strong> {{ item.value }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="startEdit(item)" class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
              Edit
            </button>
            <button @click="handleDelete(item.id)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Hapus
            </button>
          </div>
        </div>
      </section>

      <!-- TAMBAHAN -->
      <section>
        <h2 class="text-xl font-semibold mb-4">📎 Data Tambahan</h2>
        <div v-if="response.tambahan.length === 0" class="text-gray-500 dark:text-gray-300">Tidak ada data.</div>
        <div v-for="item in response.tambahan" :key="item.id" class="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-3 flex justify-between items-start">
          <div>
            <p><strong>Key:</strong> {{ item.key }}</p>
            <p><strong>Value:</strong> {{ item.value }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="startEdit(item)" class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
              Edit
            </button>
            <button @click="handleDelete(item.id)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Hapus
            </button>
          </div>
        </div>
      </section>
    </template>

    <!-- Modal Edit -->
    <div v-if="editing" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div class="bg-KKNWhite dark:bg-KKNBlack p-6 rounded shadow-lg w-96 space-y-4 text-KKNBlack dark:text-KKNWhite">
        <h2 class="text-lg font-semibold">Edit Data</h2>
        <input v-model="editForm.key" class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-KKNBlack dark:text-KKNWhite" />
        <input v-model="editForm.value" class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-KKNBlack dark:text-KKNWhite" />
        <select v-model="editForm.type" class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-KKNBlack dark:text-KKNWhite">
          <option value="inti">Inti</option>
          <option value="tambahan">Tambahan</option>
        </select>
        <div class="flex justify-end gap-2">
          <button @click="cancelEdit" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500">
            Batal
          </button>
          <button @click="submitEdit" class="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useProfile } from '~/composables/useProfile'
  
  const {
    response,
    pending,
    error,
    fetchAllProfile,
    createDataProfile,
    updateDataProfile,
    deleteDataProfile
  } = useProfile()
  
  onMounted(fetchAllProfile)
  
  // Form create
  const form = reactive({ key: '', value: '', type: 'tambahan' })
  const submitForm = async () => {
    await createDataProfile({ ...form })
    form.key = ''
    form.value = ''
    form.type = 'tambahan'
  }
  
  // Edit modal
  const editing = ref(false)
  const editId = ref(null)
  const editForm = reactive({ key: '', value: '', type: 'inti' })
  
  const startEdit = (item) => {
    editing.value = true
    editId.value = item.id
    editForm.key = item.key
    editForm.value = item.value
    editForm.type = item.type
  }
  
  const cancelEdit = () => {
    editing.value = false
  }
  
  const submitEdit = async () => {
    await updateDataProfile(editId.value, { ...editForm })
    editing.value = false
  }
  
  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      await deleteDataProfile(id)
    }
  }
  </script>
  