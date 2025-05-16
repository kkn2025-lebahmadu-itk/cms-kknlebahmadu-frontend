import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const getAccessToken = async (refreshToken) => {
    try {
      const rawAxios = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        withCredentials: true
      })

      const response = await rawAxios.post('/api/auth/token/refresh', {
        refresh: refreshToken
      })

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Terjadi kesalahan saat refresh token'
      }
    }
  }

  nuxtApp.provide('getAccessToken', getAccessToken)
})
