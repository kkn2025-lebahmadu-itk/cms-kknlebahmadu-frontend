import api from '../api'

const register = async (username, email, password) => {
    try {
    const response = await api.post('/api/auth/register', {
        username, email, password
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

export default register