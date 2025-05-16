<script setup>
const accessToken = useCookie('access_token') // nama cookiemu
const refreshToken = useCookie('refresh_token') // nama cookiemu
accessToken.value = null
refreshToken.value = null
const router = useRouter()
router.push('/')

</script>