export const useReport = () => {
    const response = ref(null)
    const pending = ref(false)
    const error = ref(null)
    const { $api } = useNuxtApp()
    const fetchAllReport = async () => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.get('api/report')
            response.value = res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'
        } finally {
            pending.value = false
        }
    }

    const createReport = async (data) => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.post('api/report', data, {isPublic: true})
            response.value = res.data

        }catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'

        } finally{
            pending.value = false
        }
    }
    const deleteReport = async (id) => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.delete(`api/report/${id}`)
            response.value = res.data

        }catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'

        } finally{
            pending.value = false
        }
    }

return {
        fetchAllReport,
        createReport,
        deleteReport,
        response,
        pending,
        error
    }
    
}