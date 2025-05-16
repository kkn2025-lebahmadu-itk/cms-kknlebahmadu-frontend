export const useGallery = () => {


    const response = ref(null)
    const pending = ref(false)
    const error = ref(null)
    const { $api } = useNuxtApp()
    const fetchAllPicture = async () => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.get('api/gallery',{
                isPublic: true
            })
            response.value = res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'
        } finally {
            pending.value = false
        }
    }


    const uploadPicture = async (data) => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.post('api/gallery', data)
            response.value = res.data

        }catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'

        } finally{
            pending.value = false
        }
    }
    const deletePicture = async (id) => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.delete(`api/gallery/${id}`)
            response.value = res.data

        }catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'

        } finally{
            pending.value = false
        }
    }

    return {
        fetchAllPicture,
        uploadPicture,
        deletePicture,
        response,
        pending,
        error
    }
}
