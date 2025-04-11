import api from '../api'

const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
        email, password
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

export default login