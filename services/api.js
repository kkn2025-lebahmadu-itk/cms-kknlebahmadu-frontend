import axios from "axios"
import getAccessToken from './function/getAccessToken'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true
})

api.interceptors.request.use(async (config) => {
  const refreshToken = useCookie('refresh_token')

  const { success, data } = await getAccessToken(refreshToken)
  if (success) {
    const accessToken = data.access
    const cookie = useCookie('access_token')
    cookie.value = accessToken

    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}, error => Promise.reject(error))

export default api