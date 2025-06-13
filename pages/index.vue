<script setup>
import { ref, computed, onMounted } from 'vue'
import { useKeluhan } from '../composables/useKeluhan'
import { useHome } from '../composables/useHome'
import { useProfile } from '../composables/useProfile'
import { useRouter } from 'vue-router'

const router = useRouter()
const { createKeluhan } = useKeluhan()
const { response: homeRes, pending: homePending, error: homeError, fetchHome } = useHome()
const { response: profileRes, pending: profilePending, error: profileError, fetchAllProfile } = useProfile()


// aspirasi
const { createReport, pending: reportPending, error: reportError } = useReport()
const aspirasiTitle = ref('')
const aspirasiContent = ref('')
const aspirasiMessage = ref('')
const submittingAspirasi = ref(false)

const submitAspirasi = async () => {
  if (!aspirasiTitle.value || !aspirasiContent.value) {
    aspirasiMessage.value = 'Judul dan isi aspirasi harus diisi.'
    return
  }
  submittingAspirasi.value = true
  aspirasiMessage.value = ''
  try {
    await createReport({ title: aspirasiTitle.value, content: aspirasiContent.value })
    aspirasiMessage.value = 'Aspirasi berhasil dikirim.'
    aspirasiTitle.value = ''
    aspirasiContent.value = ''
  } catch {
    aspirasiMessage.value = reportError.value || 'Gagal mengirim aspirasi.'
  } finally {
    submittingAspirasi.value = false
  }
}

// komputasi data
const news = computed(() => homeRes.value?.data?.data?.news || [])
const gallery = computed(() => homeRes.value?.data?.data?.galeri || [])

const profileInti = computed(() => profileRes.value?.inti || [])
const profileTambahan = computed(() => profileRes.value?.tambahan || [])

// State formulir keluhan
const complaintUser = ref('')
const complaintContent = ref('')
const submitting = ref(false)
const submitMessage = ref('')

const submitComplaint = async () => {
  if (!complaintUser.value || !complaintContent.value) {
    submitMessage.value = 'Nama dan isi keluhan harus diisi.'
    return
  }
  submitting.value = true
  submitMessage.value = ''
  try {
    await createKeluhan(complaintUser.value, complaintContent.value)
    submitMessage.value = 'Keluhan berhasil dikirim.'
  } catch {
    submitMessage.value = 'Gagal mengirim keluhan.'
  } finally {
    submitting.value = false
  }
}

// Carousel
const currentSlide = ref(0)
let slideInterval = null

const startAutoSlide = () => {
  stopAutoSlide()
  slideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
}
const stopAutoSlide = () => {
  if (slideInterval) clearInterval(slideInterval)
}
const nextSlide = () => {
  if (gallery.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % gallery.value.length
  restartAutoSlide()
}
const prevSlide = () => {
  if (gallery.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + gallery.value.length) % gallery.value.length
  restartAutoSlide()
}
const restartAutoSlide = () => {
  stopAutoSlide()
  startAutoSlide()
}

// Navigate to news detail
const goToNewsDetail = (slug) => {
  router.push(`/berita/${slug}`)
}


const expandedItemIds = ref([])

const isExpanded = (id) => expandedItemIds.value.includes(id)

const toggleExpand = (id) => {
  if (isExpanded(id)) {
    expandedItemIds.value = expandedItemIds.value.filter(item => item !== id)
  } else {
    expandedItemIds.value.push(id)
  }
}

// Untuk mendeteksi overflow secara dinamis
const isOverflowing = ref({}) // Map id -> boolean

const setOverflowStatus = (id, el) => {
  if (!el) return
  isOverflowing.value[id] = el.scrollHeight > el.clientHeight
}

const stripHtml = (html) => {
  const temp = document.createElement("div")
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ""
}



const goToPage = (page) => {
  if (page === '...') return
  currentPage.value = page
}

onMounted(() => {
  fetchHome()
  fetchAllProfile()
  startAutoSlide()
})
</script>

<template>
<!-- Galeri Section -->
<section class="px-6 pt-6 w-full max-w-screen-xl mx-auto animate-fade-in">
  <!-- <h2 class="text-xl font-semibold mb-4 text-center">Galeri</h2> -->
  <div class="relative w-full overflow-hidden rounded-lg dark:border-KKNWhite dark:border-2 shadow-2xl">
    <div class=" flex transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <div v-for="(item, index) in gallery" :key="index" class="flex-shrink-0 w-full">
        <img :src="item.path" :alt="item.caption || `Gallery Image ${index+1}`" class="w-full h-80 object-cover" />
      </div>
    </div>
    <button @click="prevSlide" class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md">‹</button>
    <button @click="nextSlide" class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md">›</button>
  </div>

  <div class="flex justify-center mt-4 space-x-3">
    <button
      v-for="(item, index) in gallery"
      :key="index"
      @click="() => { currentSlide = index; restartAutoSlide() }"
      class="w-3 h-3 rounded-full"
      :class="[currentSlide === index ? 'bg-KKNOrange' : 'bg-black dark:bg-KKNWhite', 'transition-all duration-300']"
    ></button>
  </div>
</section>

<!-- Berita & Profil Section -->
<section class="p-6 w-full max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
  <!-- Berita -->
  <main class="lg:col-span-2 space-y-12">
    <h1 class="text-3xl font-bold mb-6">Beranda</h1>



    <div v-if="homePending" class="text-gray-600">🔄 Loading...</div>
    <div v-else-if="homeError" class="text-red-600">❌ Error: {{ homeError }}</div>
    <div v-else class="space-y-6">
      <div
        v-for="item in news"
        :key="item.id"
        class="max-h-[40dvh] p-5 flex flex-col sm:flex-row bg-white dark:bg-KKNBlack rounded-lg overflow-hidden shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
        @click="goToNewsDetail(item.slug)"
      >
        <img :src="item.thumbnail_url" :alt="item.title" class="w-full sm:w-1/3 h-48 object-cover border-2 border-gray-300" />
        <div class="p-4 flex-1">
          <h3 class="text-lg font-semibold mb-2">{{ item.title }}</h3>

            <article class="flex flex-col gap-2">
              <p class="text-gray-700 dark:text-KKNWhite">
                {{ stripHtml(item.content).slice(0, 200) }}...
              </p>
              <button
                @click.stop="goToNewsDetail(item.slug)"
                class="text-KKNOrange font-medium hover:underline focus:outline-none self-start"
              >
                Baca Selengkapnya
              </button>
            </article>


        </div>
      </div>

    </div>
  </main>

  <!-- Profil -->
  <aside class="bg-white dark:bg-KKNBlack p-4 mt-15 rounded-lg shadow-2xl">
    



    <h2 class="text-lg font-semibold mb-3">Profil RT 45</h2>
    <div v-if="profilePending" class="text-gray-600">🔄 Memuat profil...</div>
    <div v-else-if="profileError" class="text-red-600">❌ {{ profileError }}</div>
    <div v-else>
      <h3 v-if="profileInti" class="font-medium mt-2">Data Inti</h3>
      <ul class="list-disc list-inside mb-10">
        <li v-for="item in profileInti" :key="item.id">{{ item.key }}: {{ item.value }}</li>
      </ul>
      

      <h3 v-if="profileTambahan != 0" class="font-medium">Data Tambahan</h3>
      <ul class="list-disc list-inside mb-10">
        <li v-for="item in profileTambahan" :key="item.id">{{ item.key }}: {{ item.value }}</li>
      </ul>
    </div>
    <div class="w-full  rounded-xl overflow-hidden mb-4">
  <iframe
    src="https://www.google.com/maps/d/embed?mid=1ykpdVCCu4adAxZw26EP_a63w8MaanM8&hl=in&ehbc=2E312F"
    class="w-full h-[40dvh]"
    style="border:0;"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>
  </aside>
</section>

  <!-- Form Aspirasi -->
  <section class="px-6 py-8 m-5 w-full max-w-[60dvw] mx-auto bg-white dark:bg-KKNBlack rounded-lg shadow-2xl animate-fade-in">
    <h2 class="text-xl font-semibold mb-4">Kirim Aspirasi</h2>
    <div class="space-y-4">
      <input
        v-model="aspirasiTitle"
        type="text"
        placeholder="Judul Aspirasi"
        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
      />
      <textarea
        v-model="aspirasiContent"
        rows="4"
        placeholder="Tulis aspirasi Anda di sini..."
        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
      ></textarea>
      <button
        @click="submitAspirasi"
        :disabled="submittingAspirasi || reportPending"
        class="px-4 py-2 bg-KKNOrange text-white rounded hover:bg-orange-600 transition disabled:opacity-50"
      >
        {{ submittingAspirasi || reportPending ? 'Mengirim...' : 'Kirim Aspirasi' }}
      </button>
      <p v-if="aspirasiMessage" :class="aspirasiMessage.includes('berhasil') ? 'text-green-600' : 'text-red-600'">
        {{ aspirasiMessage }}
      </p>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.7s ease-out forwards;
}
</style>
