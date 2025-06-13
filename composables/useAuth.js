export const useAuth = () => {
    const register = async (username, email, password) => {
        try {
            const {$api} = useNuxtApp()
            console.log($api)
            const response = await $api.post('/api/auth/register', {
                username,
                email,
                password
            })
            return {
                success: true,
                data: response.data
            }
        }
        catch (error) {
            console.log(error)
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi Kesalahan'
            }
        }
    }

    const login = async (email, password) => {
        try {
            const {$api} = useNuxtApp()
            const response = await $api.post('/api/auth/login', {
                email,
                password
            }, {
                isPublic: true
            })
            return {
                success: true,
                data: response.data
            }
        }
        catch (error) {
            console.log(error)
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi Kesalahan'
            }
        }
    }

    const changePassword = async (old_password, new_password) => {
        try {
            const { $api } = useNuxtApp()
            const response = await $api.post('/api/auth/change-password', {
                old_password,
                new_password
            }) // tidak perlu manual pasang headers, default akan otomatis pakai Bearer token
            return {
                success: true,
                data: response.data
            }
        }
        catch (error) {
            console.log(error)
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi Kesalahan'
            }
        }
    }

    
    return {
        register,
        login,
        changePassword
    }
}
