<template>
  <section class="py-6 bg-gray-50">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-6">📝 Aspirasi</h1>

      <!-- Form Submit -->
      <!-- <form @submit.prevent="handleSubmit" class="mb-8 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            v-model="form.user"
            type="text"
            placeholder="Nama Anda"
            required
            class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <textarea
            v-model="form.content"
            placeholder="Tulis aspirasi Anda..."
            rows="2"
            required
          class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          ></textarea>
        </div>
        <button
          type="submit"
          :disabled="pending"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {{ pending ? 'Mengirim...' : 'Kirim Aspirasi' }}
        </button>
        <p v-if="error" class="text-red-500 mt-2">❌ {{ error }}</p>
      </form> -->

      <!-- List Aspirasi -->
      <div v-if="pending && !formSubmitting" class="text-gray-600">🔄 Memuat aspirasi...</div>
      <div v-else-if="!complaints.length" class="text-gray-500">Belum ada aspirasi.</div>
      <div v-else class="space-y-4">
        <div
          v-for="item in complaints"
          :key="item.id"
          class="container mx-auto max-w-[65vw] bg-white p-6 border border-gray-300 rounded-lg shadow hover:shadow-lg transition relative"
        >
          <p class="text-sm text-gray-700 mb-2"><strong>{{ item.user }}</strong></p>
          <p class="text-gray-800 mb-4">{{ item.content }}</p>
          <p class="text-xs text-gray-500 mb-4">
            {{ new Date(item.created_at).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) }}
          </p>
          <div class="absolute top-6 right-6">
            <span
              :class="{
                'text-yellow-600': item.status === 'pending',
                'text-green-600': item.status === 'valid',
                'text-red-600': item.status === 'tidak_valid'
              }"
              class="font-semibold uppercase text-xs"
            >
              {{ item.status.replace('_', ' ') }}
            </span>
          </div>
          <div class="flex max-w-[40dvw] mx-auto space-x-2">
            <button
              @click="changeStatus(item.id, 'valid')"
              :disabled="pending"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg text-sm transition disabled:opacity-50"
            >
              Valid
            </button>
            <button
              @click="changeStatus(item.id, 'tidak_valid')"
              :disabled="pending"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg text-sm transition disabled:opacity-50"
            >
              Tolak
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useComplaint } from '~/composables/useComplaint'

const { fetchAllComplaint, createComplaint, updateStatusComplaint, response, pending, error } = useComplaint()

const complaints = ref([])
const form = reactive({ user: '', content: '' })
const formSubmitting = ref(false)

const loadData = async () => {
  await fetchAllComplaint()
  if (response.value?.data) complaints.value = response.value.data
}

onMounted(loadData)

const handleSubmit = async () => {
  formSubmitting.value = true
  await createComplaint({ user: form.user, content: form.content })
  if (!error.value) {
    form.user = ''
    form.content = ''
    await loadData()
  }
  formSubmitting.value = false
}

const changeStatus = async (id, status) => {
  await updateStatusComplaint(id, { status })
  if (!error.value) {
    const idx = complaints.value.findIndex(c => c.id === id)
    if (idx !== -1) complaints.value[idx].status = status
  }
}
</script>
