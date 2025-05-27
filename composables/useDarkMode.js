import { useCookie } from '#app'
import { ref, watchEffect } from 'vue'

export const useDarkMode = () => {
  const isDark = ref(false)
  const darkCookie = useCookie('dark_mode')

  // Inisialisasi dari cookie / prefers-color-scheme
  if (darkCookie.value !== undefined) {
    isDark.value = darkCookie.value === 'true'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  watchEffect(() => {
    const root = document.documentElement
    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    darkCookie.value = isDark.value.toString()
  })

  const toggleDark = () => {
    isDark.value = !isDark.value
  }

  return { isDark, toggleDark }
}
