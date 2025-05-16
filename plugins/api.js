import axios from "axios"
import * as jwt_decode from 'jwt-decode'
import { defineNuxtPlugin } from '#app'


export default defineNuxtPlugin((nuxtApp) => {
  const { $getAccessToken } = useNuxtApp()

  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true
  })

  // api.interceptors.request.use(async (config) => {
  //   // Lewati jika endpoint publik
  //   if (config.isPublic) return config
  
  //   const accessToken = useCookie('access_token').value
  
  //   if (accessToken) {
  //     config.headers.Authorization = `Bearer ${accessToken}`
  //     return config
  //   }
  
  //   const refreshToken = useCookie('refresh_token').value
  //   if (!refreshToken) {
  //     return Promise.reject(new Error('Tidak ada refresh token. Silakan login kembali.'))
  //   }
  
  //   const { success, data, message } = await $getAccessToken(refreshToken)
  
  //   if (success) {
  //     const newAccessToken = data.access
  //     useCookie('access_token').value = newAccessToken
  //     config.headers.Authorization = `Bearer ${newAccessToken}`
  //     return config
  //   } else {
  //     return Promise.reject(new Error(message || 'Refresh token tidak valid. Silakan login kembali.'))
  //   }
  // }, error => Promise.reject(error))
  
  api.interceptors.request.use(async (config) => {
  if (config.isPublic) return config

  const accessTokenCookie = useCookie('access_token')
  const refreshToken = useCookie('refresh_token').value

  let accessToken = accessTokenCookie.value

  // Cek apakah token expired
  if (accessToken) {
    const {$jwt} = useNuxtApp()
    const decoded = $jwt(accessToken)
    // console.log('Decoded JWT:', decoded)
    const currentTime = Math.floor(Date.now() / 1000)

    if (decoded.exp < currentTime) {
      console.log('Access token expired, refreshing...')

      // Refresh token
      const { success, data, message } = await nuxtApp.$getAccessToken(refreshToken)
      if (!success) throw new Error(message || 'Gagal refresh token.')

      accessToken = data.access
      accessTokenCookie.value = accessToken
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}, error => Promise.reject(error))

  nuxtApp.provide('api', api)
})
