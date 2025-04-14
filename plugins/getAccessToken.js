import axios from 'axios'
export default defineNuxtPlugin((nuxtApp) => {

  const getAccessToken = async () => {
    try {
      const refreshToken = useCookie()
      const rawAxios = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        withCredentials: true
      })
  
      const response = await rawAxios.post('/api/auth/token/refresh', {
        refresh: refreshToken.value
      })
  
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Terjadi Kesalahan'
      }
    }
  }

  nuxtApp.provide('getAccessToken', getAccessToken)


})