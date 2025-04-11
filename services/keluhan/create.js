import api from '../api'

const createKeluhan = async (user, content) => {
    try {
    const response = await api.post('/api/complaint', {
        user, content
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

export default createKeluhan