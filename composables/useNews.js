export const useNews = () => {

    const response = ref(null)
    const pending = ref(false)
    const error = ref(null)
    const { $api } = useNuxtApp()
    const fetchAllNews = async () => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.get('api/news')
            response.value = res.data.results
            // console.log(res.data)
            
        } catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'
        } finally {
            pending.value = false
        }



    }

    const fetchNewsByPage = async (page = 1) => {
        pending.value = true
        error.value = null
        try {
          const res = await $api.get(`/api/news?page=${page}`,{
            isPublic: true
        })
          response.value = res.data
          console.log(res.data)
        //   return res.data // langsung return seluruh objek response
        } catch (err) {
          error.value = err.response?.data?.message || 'Terjadi kesalahan saat mengambil data.'
        } finally {
          pending.value = false
        }
      }
      
      

    const fetchNewsBySlug = async (slug) => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.get(`api/news/${slug}`,{
                isPublic: true
            })
            response.value = res
        } catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'
        } finally {
            pending.value = false
        }
    }
    const createNews = async (data) => {
        pending.value = true
        error.value = null
        try{
            const res = await $api.post('api/news', data)
            response.value = res?.data || {}

            console.log(res)

        }catch (err) {
            console.log(err)
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'

        } finally{
            pending.value = false
        }
    }

    const updateNews = async (slug, data) => { 
        pending.value = true
        error.value = null
        try{
            const res = await $api.put(`api/news/${slug}`, data)
            response.value = res.data

        }catch (err) {
        
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'

        } finally{
            pending.value = false
        }
    }
    const deleteNews = async (slug) => { 
        pending.value = true
        error.value = null
        try{
            const res = await $api.delete(`api/news/${slug}`)
            response.value = res.data

        }catch (err) {
            error.value = err.response?.data?.message || 'Terjadi Kesalahan'

        } finally{
            pending.value = false
        }
    }
    return {
        response,
        pending,
        error,
        fetchAllNews,
        fetchNewsBySlug,
        createNews,
        updateNews,
        deleteNews,
        fetchNewsByPage
    }

}