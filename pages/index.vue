<script setup>
import home from '../services/home.js'
import createKeluhan from '../services/keluhan/create.js'

const { data: response, pending, error } = useAsyncData('home', home, {
    server: false
})
console.log(response.data)
const news = computed(() => response.value?.data?.data?.news || [])
const gallery = computed(() => response.value?.data?.data?.galeri || [])

// 🆕 Complaint form state
const complaintUser = ref('')
const complaintContent = ref('')
const submitting = ref(false)
const submitMessage = ref('')

// 🆕 Submit handler
const submitComplaint = async () => {
  if (!complaintUser.value || !complaintContent.value) {
    submitMessage.value = 'Nama dan isi keluhan harus diisi.'
    return
  }

  submitting.value = true
  submitMessage.value = ''

  try {
    // This assumes your backend accepts this structure
    const response = await createKeluhan(complaintUser.value, complaintContent.value)
		console.log(response)
  } catch (err) {
    submitMessage.value = 'Gagal mengirim keluhan.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
    <h1>Hello, home</h1>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <h2>Berita:</h2>
      <div v-for="item in news || []" :key="item.id">
        <News :data="item" />
      </div>

      <h2 class="mt-6">Galeri:</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="item in gallery || []" :key="item.id" class="border rounded shadow-sm overflow-hidden">
          <img :src="item.path" :alt="item.caption || 'Gallery Image'" class="w-full h-48 object-cover" />
        </div>
      </div>

      <h2 class="mt-6">Keluhan:</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="item in gallery || []" :key="item.id" class="border rounded shadow-sm overflow-hidden">
          <img :src="item.path" :alt="item.caption || 'Gallery Image'" class="w-full h-48 object-cover" />
        </div>
      </div>
    </div>

    <h2 class="mt-6">Keluhan:</h2>
		<form @submit.prevent="submitComplaint" class="max-w-md space-y-4">
			<div>
				<label class="block mb-1 font-medium">Nama</label>
				<input v-model="complaintUser" type="text" class="w-full border px-3 py-2 rounded" />
			</div>
			<div>
				<label class="block mb-1 font-medium">Isi Keluhan</label>
				<textarea v-model="complaintContent" rows="4" class="w-full border px-3 py-2 rounded"></textarea>
			</div>
			<div>
				<button
					type="submit"
					class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
					:disabled="submitting"
				>
					{{ submitting ? 'Mengirim...' : 'Kirim Keluhan' }}
				</button>
			</div>
			<p class="text-sm text-green-600" v-if="submitMessage">{{ submitMessage }}</p>
		</form>
</template>
 