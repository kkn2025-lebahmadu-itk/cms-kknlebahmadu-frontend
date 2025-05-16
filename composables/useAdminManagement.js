// composables/useAdmin.js
import { ref } from 'vue'
import { useNuxtApp } from '#app'

export const useAdminManagement = () => {
  const response = ref(null)
  const pending = ref(false)
  const error = ref(null)
  const { $api } = useNuxtApp()

  /**
   * GET /api/admin
   * – Mengambil semua user dan daftar admin
   * Response:
   * {
   *   users: [ { id, username, role }, … ],
   *   admins: [ { id, username, role }, … ]
   * }
   */
  const fetchAllAdmin = async () => {
    pending.value = true
    error.value = null
    try {
      const res = await $api.get('api/admin')
      response.value = res.data
    //   console.log('response', response.value)
    } catch (err) {
        console.log('error', err)
      error.value = err.response?.data?.message || 'Terjadi Kesalahan'
      
    } finally {
      pending.value = false
    }
  }

  /**
   * POST /api/admin
   * – Assign user dengan userId menjadi admin
   * Payload: { id: userId }
   * Response:
   * { message: "User dengan id 2 berhasil dibuat menjadi admin" }
   */
  const createAdmin = async (userId) => {
    pending.value = true
    error.value = null
    try {
      const res = await $api.post(`api/admin/${userId}`)
      response.value = res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Terjadi Kesalahan'
    } finally {
      pending.value = false
    }
  }

  /**
   * DELETE /api/admin/{userId}
   * – Revoke hak admin, kembalikan role user biasa
   * Response:
   * { message: "User dengan id 2 berhasil dikembalikan menjadi user" }
   */
  const deleteAdmin = async (userId) => {
    pending.value = true
    error.value = null
    try {
      const res = await $api.delete(`api/admin/${userId}`)
      response.value = res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Terjadi Kesalahan'
    } finally {
      pending.value = false
    }
  }

  return {
    fetchAllAdmin,
    createAdmin,
    deleteAdmin,
    response,
    pending,
    error,
  }
}
