export interface JwtPayload {
  userId?: string;
  username?: string;
  roleId?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export const STORAGE_KEYS = Object.freeze({
  ACCESS_TOKEN: 'ayotrip_access_token',
  REFRESH_TOKEN: 'ayotrip_refresh_token',
  AUTH_USER: 'ayotrip_auth_user',
  USER_PROFILE: 'ayotrip_user_profile',
  IS_LOGGED_IN: 'ayotrip_is_logged_in',
});

/**
 * Parse standard JWT token payload securely in browser & webview
 */
export const parseJwtPayload = <T = JwtPayload>(token: string): T | null => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload =
      typeof window !== 'undefined' && typeof window.atob === 'function'
        ? decodeURIComponent(
            window
              .atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
        : null;
    if (!jsonPayload) return null;
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
};

/**
 * Check if a JWT token has already expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) return true;
  // exp is in seconds, Date.now() is in milliseconds
  return Date.now() >= payload.exp * 1000;
};

export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;
  } catch {
    return null;
  }
};

export const setAccessToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (e) {
    console.error('Failed to set access token in localStorage:', e);
  }
};

export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null;
  } catch {
    return null;
  }
};

export const setRefreshToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  } catch (e) {
    console.error('Failed to set refresh token in localStorage:', e);
  }
};

export const setAllAuthTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  try {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
  } catch (e) {
    console.error('Failed to update login state in localStorage:', e);
  }
};

export const removeAllAuthTokens = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
    window.dispatchEvent(new Event('ayotrip_user_updated'));
  } catch (e) {
    console.error('Failed to remove auth tokens from localStorage:', e);
  }
};
