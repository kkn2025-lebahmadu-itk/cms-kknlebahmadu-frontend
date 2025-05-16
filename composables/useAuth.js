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

    return {
        register, login
    }
}