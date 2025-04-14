<script setup>
// import home from '../services/home.js'
// import createKeluhan from '../services/keluhan/create.js'

// const { data: response, pending, error } = useAsyncData('home', home, {
//     server: false
// })
const {createKeluhan} = useKeluhan()
const { response, pending, error, fetchHome } = useHome()
onMounted(() => {
  fetchHome()
})
console.log('response', response)

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
  <Header />
  <section class="p-6 max-w-max mx-auto bg-KKNwhite">
    <div></div>
    <h1 class="text-3xl font-bold mb-6">🏠 Beranda</h1>

    <div v-if="pending" class="text-gray-600">🔄 Loading...</div>
    <div v-else-if="error" class="text-red-600">❌ Error: {{ error }}</div>

    <div class="container bg-KKNWhite  p-[15px] rounded-[20px] drop-shadow-md drop-shadow-KKNBlack" v-else>
      <!-- Berita -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-3">📰 Berita</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="item in news || []" :key="item.id" class="p-4 border rounded-lg shadow hover:shadow-md transition">
            <News :data="item" />
          </div>
        </div>
      </section>

      <!-- Galeri -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-3">📸 Galeri</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div v-for="item in gallery || []" :key="item.id" class="border rounded overflow-hidden">
            <img :src="item.path" :alt="item.caption || 'Gallery Image'" class="w-full h-48 object-cover" />
          </div>
        </div>
      </section>
    </div>

    <!-- Form Keluhan -->
    <section class="mt-12 max-w-md">
    <div class="container bg-KKNWhite  p-[15px] rounded-[20px] drop-shadow-md drop-shadow-KKNBlack">

      <h2 class="text-xl font-semibold mb-4">📝 Formulir Keluhan</h2>

      <form @submit.prevent="submitComplaint" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium">Nama</label>
          <input v-model="complaintUser" type="text" class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block mb-1 font-medium">Isi Keluhan</label>
          <textarea v-model="complaintContent" rows="4" class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-50"
            :disabled="submitting"
          >
            {{ submitting ? 'Mengirim...' : 'Kirim Keluhan' }}
          </button>
          <button>
            <NuxtLink to="/auth/login" class="text-blue-600 bg-amber-100 hover:underline mt-2 block">Login</NuxtLink>
          </button>
        </div>

        <p class="text-sm text-green-600" v-if="submitMessage">{{ submitMessage }}</p>
      </form>
      </div>
    </section>
  
  </section>
</template>
