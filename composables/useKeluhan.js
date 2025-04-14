import { ref } from 'vue'
import { useNuxtApp } from '#app'

export const useKeluhan = () => {
  const response = ref(null)
  const pending = ref(false)
  const error = ref(null)

  const { $api } = useNuxtApp()

  const createKeluhan = async (user, content) => {
    try {
      pending.value = true
      error.value = null

      const res = await $api.post('/api/complaint', {
        user,
        content
      })

      response.value = res.data // optional simpan di response
      return {
        success: true,
        data: res.data
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Terjadi Kesalahan'
      return {
        success: false,
        message: error.value
      }
    } finally {
      pending.value = false
    }
  }

  return {
    response,
    pending,
    error,
    createKeluhan
  }
}
