export default defineNuxtPlugin(() => {
    const decodeJWT = (token) => {
      try {
        const payload = token.split('.')[1]
        return JSON.parse(atob(payload))
      } catch (e) {
        return null
      }
    }
  
    return {
      provide: {
        jwt: decodeJWT
      }
    }
  })
  