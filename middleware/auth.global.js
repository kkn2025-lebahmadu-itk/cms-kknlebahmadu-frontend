export default defineNuxtRouteMiddleware(async (to, from) => {
  const publicPages = ["/", "/galeri", "/auth/login", "/auth/register"];
  if (publicPages.includes(to.path)) return;

  const accessTokenCookie = useCookie('access_token');
  const refreshTokenCookie = useCookie('refresh_token');
  const { $jwt, $getAccessToken } = useNuxtApp();

  const accessToken = accessTokenCookie.value;
  const refreshToken = refreshTokenCookie.value;

  const now = Math.floor(Date.now() / 1000);

  const isTokenValid = (token) => {
    if (!token) return false;
    const decoded = $jwt(token);
    return decoded?.exp && decoded.exp > now;
  };

  if (isTokenValid(accessToken)) return;

  if (refreshToken && isTokenValid(refreshToken)) {
    const { success, data } = await $getAccessToken(refreshToken);
    if (success && data.access) {
      accessTokenCookie.value = data.access;
      return;
    }
  }

  // Redirect dengan tambahan informasi dari mana redirect dilakukan

// Ini jangan lupa di uncomment
  // accessTokenCookie.value = null;
  // refreshTokenCookie.value = null;
  return navigateTo({ path: '/auth/login', query: { redirectedFrom: from.path } });
});
