// composables/useHome.ts
import { ref } from 'vue'
import { useNuxtApp } from '#app'

export const useHome = () => {
  const response = ref(null)
  const pending = ref(false)
  const error = ref(null)

  const { $api } = useNuxtApp()

  const fetchHome = async () => {
    pending.value = true
    error.value = null

    try {
      const res = await $api.get('/api/home')
      response.value = res
    } catch (err) {
      error.value = err.response?.data?.message || 'Terjadi Kesalahan'
    } finally {
      pending.value = false
    }
  }

  return {
    response,
    pending,
    error,
    fetchHome
  }
}
