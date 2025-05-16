export const useRecap = () => {
    const response = ref([])
    const pending = ref(false)
    const error = ref(null)
    const { $api } = useNuxtApp()
  
    const fetchAllRecap = async () => {
      pending.value = true
      error.value = null
      try {
        const res = await $api.get('/api/recap')
        response.value = res.data.recaps || []
      } catch (err) {
        error.value = err.response?.data?.message || 'Terjadi Kesalahan'
      } finally {
        pending.value = false
      }
    }
  
    const createRecap = async (data) => {
      pending.value = true
      error.value = null
      try {
        const res = await $api.post('/api/recap', data)
        await fetchAllRecap()
      } catch (err) {
        error.value = err.response?.data?.message || 'Terjadi Kesalahan'
      } finally {
        pending.value = false
      }
    }
  
    const deleteRecap = async (id) => {
      pending.value = true
      error.value = null
      try {
        const res = await $api.delete(`/api/recap/${id}`)
        await fetchAllRecap()
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
      fetchAllRecap,
      createRecap,
      deleteRecap
    }
  }