import api from './api'

const home = async () => {
  try {
    const response = await api.get('/api/home')
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

export default home