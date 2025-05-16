export const useComplaint = () => {
    const response = ref(null)
    const pending = ref(false)
    const error = ref(null)
    const { $api } = useNuxtApp()
    const fetchAllComplaint = async () => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.get('api/complaint')
            response.value = res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'
        } finally {
            pending.value = false
        }
    }
    const createComplaint = async (data) => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.post('api/complaint', data)
            response.value = res.data

        }catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'

        } finally{
            pending.value = false
        }
    }
    const updateStatusComplaint = async (id, data) => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.put(`api/complaint/${id}`, data)
            response.value = res.data

        }catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'

        } finally{
            pending.value = false
        }
    }
    return {
        fetchAllComplaint,
        createComplaint,
        updateStatusComplaint,
        response,
        pending,
        error
    }
}
