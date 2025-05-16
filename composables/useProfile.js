// composables/useProfile.ts
export const useProfile = () => {
    const response = ref({ inti: [], tambahan: [] })
    const pending = ref(false)
    const error = ref(null)
    const { $api } = useNuxtApp()
  
    const fetchAllProfile = async () => {
      pending.value = true
      error.value = null
      try {
        const res = await $api.get('api/profile',{
          isPublic: true
      })
        response.value = res.data.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Terjadi Kesalahan'
      } finally {
        pending.value = false
      }
    }
  
    const createDataProfile = async (data) => {
      pending.value = true
      error.value = null
      try {
        const res = await $api.post('api/profile', data)
        await fetchAllProfile()
      } catch (err) {
        error.value = err.response?.data?.message || 'Terjadi Kesalahan'
      } finally {
        pending.value = false
      }
    }
  
    const updateDataProfile = async (id, data) => {
      pending.value = true
      error.value = null
      try {
        const res = await $api.put(`api/profile/${id}`, data)
        await fetchAllProfile()
      } catch (err) {
        error.value = err.response?.data?.message || 'Terjadi Kesalahan'
      } finally {
        pending.value = false
      }
    }
  
    const deleteDataProfile = async (id) => {
      pending.value = true
      error.value = null
      try {
        const res = await $api.delete(`api/profile/${id}`)
        await fetchAllProfile()
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
      fetchAllProfile,
      createDataProfile,
      updateDataProfile,
      deleteDataProfile
    }
  }
  