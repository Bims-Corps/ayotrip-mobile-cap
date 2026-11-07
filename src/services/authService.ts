export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-ayotrip.bmstudio.my.id'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  displayName: string
  email: string
  password: string
  username: string
  phoneNumber: string
  dateOfBirth: string // ISO 8601 string, e.g. "2001-01-01T00:00:00.000Z"
  userRole: 'user'
}

export interface RegisterUserData {
  id: string
  email: string
  username: string
  phoneNumber: string
  isTravelAgentProvider: boolean
  isActive: boolean
  isVerified: boolean
  isBanned: boolean
  bannedReason: string | null
  lastLogin: string | null
  lastLoginIp: string | null
  failedAttempts: number
  lockedUntil: string | null
  createdAt: string
  updatedAt: string
  roleId: string
}

export interface RegisterApiResponse {
  status: number
  body: {
    isError: boolean
    message: string
    data: RegisterUserData
  }
}

export interface UserRole {
  id: string
  name: string
  description: string
  type: string
}

export interface UserProfileData {
  id: string
  accountId: string
  displayName: string
  avatarUrl: string | null
  dateOfBirth: string | null
  gender: string | null
  bio: string | null
  preference: unknown
  createdAt: string
  updatedAt: string
  currentLocation: string | null
}

export interface LoginUserData {
  id: string
  email: string
  username: string
  phoneNumber: string
  isTravelAgentProvider: boolean
  isActive: boolean
  isVerified: boolean
  isBanned: boolean
  bannedReason: string | null
  lastLogin: string | null
  lastLoginIp: string | null
  failedAttempts: number
  lockedUntil: string | null
  createdAt: string
  updatedAt: string
  roleId: string
  role: UserRole
  profile: UserProfileData
  accessToken: string
  refreshToken: string
}

export interface LoginApiResponse {
  status: number
  body: {
    isError: boolean
    message: string
    data: LoginUserData
  }
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  username?: string
  role?: string
  membershipTier: 'Silver Adventurer' | 'Gold Explorer' | 'Platinum Voyager'
  points: number
  tripsCompleted: number
  joinedDate: string
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-001',
  name: 'Budi Pratama',
  email: 'budi.pratama@gmail.com',
  phone: '+62 812-3456-7890',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  membershipTier: 'Platinum Voyager',
  points: 1250,
  tripsCompleted: 4,
  joinedDate: 'Januari 2025'
}

// Storage keys
const STORAGE_PROFILE_KEY = 'ayotrip_user_profile'
const STORAGE_AUTH_USER_KEY = 'ayotrip_auth_user'
const STORAGE_ACCESS_TOKEN_KEY = 'ayotrip_access_token'
const STORAGE_REFRESH_TOKEN_KEY = 'ayotrip_refresh_token'
const STORAGE_IS_LOGGED_IN_KEY = 'ayotrip_is_logged_in'

export const authService = {
  /**
   * Hit endpoint POST /auth/login with { email, password }
   */
  login: async (credentials: LoginRequest): Promise<LoginUserData> => {
    const url = `${API_BASE_URL}/auth/login`

    let response: Response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      })
    } catch (networkError) {
      const msg = networkError instanceof Error ? networkError.message : 'Koneksi jaringan gagal'
      throw new Error(`Gagal terhubung ke server autentikasi: ${msg}`)
    }

    let result: any
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      result = await response.json()
    } else {
      const text = await response.text()
      try {
        result = JSON.parse(text)
      } catch {
        result = { message: text || `HTTP Error ${response.status}` }
      }
    }

    if (!response.ok || result?.body?.isError || result?.isError) {
      const errorMessage =
        result?.body?.message ||
        result?.message ||
        (response.status === 400 ? 'Email atau password salah / tidak valid' : `Login gagal (Status ${response.status})`)
      throw new Error(errorMessage)
    }

    const loginData: LoginUserData = result?.body?.data || result?.data

    if (!loginData || !loginData.accessToken) {
      throw new Error('Respons server tidak menyertakan data autentikasi yang valid.')
    }

    // Persist tokens and session data
    localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, loginData.accessToken)
    localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, loginData.refreshToken)
    localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(loginData))
    localStorage.setItem(STORAGE_IS_LOGGED_IN_KEY, 'true')

    // Map to application UserProfile
    const mappedProfile: UserProfile = {
      id: loginData.id,
      name: loginData.profile?.displayName || loginData.username || loginData.email.split('@')[0],
      email: loginData.email,
      phone: loginData.phoneNumber || '+62 812-3456-7890',
      avatar:
        loginData.profile?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      username: loginData.username,
      role: loginData.role?.name,
      membershipTier: 'Platinum Voyager',
      points: 1250,
      tripsCompleted: 4,
      joinedDate: new Date(loginData.createdAt || Date.now()).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      }),
    }
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(mappedProfile))

    // Broadcast update to all components
    window.dispatchEvent(new Event('ayotrip_user_updated'))

    return loginData
  },

  /**
   * Demo / mock login helper for testing if live credentials are not readily available
   */
  loginDemo: (email = 'userprovown1@gmail.com', name = 'Provider Owner 1'): UserProfile => {
    const mockUserData: LoginUserData = {
      id: 'a97c09a3-aa74-4476-99ca-7ed52b5241d7',
      email,
      username: email.split('@')[0],
      phoneNumber: '08787878783',
      isTravelAgentProvider: false,
      isActive: true,
      isVerified: true,
      isBanned: false,
      bannedReason: null,
      lastLogin: new Date().toISOString(),
      lastLoginIp: '127.0.0.1',
      failedAttempts: 0,
      lockedUntil: null,
      createdAt: '2026-06-02T13:36:31.151Z',
      updatedAt: new Date().toISOString(),
      roleId: 'fdb863d1-fa81-4c24-8469-99a611ab1c20',
      role: {
        id: 'fdb863d1-fa81-4c24-8469-99a611ab1c20',
        name: 'travel_agent_manager',
        description: 'Manager role for travel agent provider operations.',
        type: 'PROVIDER',
      },
      profile: {
        id: '78d04296-2309-4a39-83de-b08205f78885',
        accountId: 'a97c09a3-aa74-4476-99ca-7ed52b5241d7',
        displayName: name,
        avatarUrl: null,
        dateOfBirth: null,
        gender: null,
        bio: null,
        preference: null,
        createdAt: '2026-06-02T13:36:31.151Z',
        updatedAt: new Date().toISOString(),
        currentLocation: null,
      },
      accessToken: 'demo_access_token_ayotrip_2026',
      refreshToken: 'demo_refresh_token_ayotrip_2026',
    }

    localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, mockUserData.accessToken)
    localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, mockUserData.refreshToken)
    localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(mockUserData))
    localStorage.setItem(STORAGE_IS_LOGGED_IN_KEY, 'true')

    const user: UserProfile = {
      id: mockUserData.id,
      name,
      email,
      phone: mockUserData.phoneNumber,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      username: mockUserData.username,
      role: mockUserData.role.name,
      membershipTier: 'Platinum Voyager',
      points: 1250,
      tripsCompleted: 4,
      joinedDate: 'Juni 2026',
    }
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(user))
    window.dispatchEvent(new Event('ayotrip_user_updated'))
    return user
  },

  /**
   * Hit endpoint POST /auth/register
   * Payload: { displayName, email, password, username, phoneNumber, dateOfBirth, userRole: 'user' }
   */
  register: async (
    payload: Omit<RegisterRequest, 'userRole'> & { userRole?: 'user' }
  ): Promise<RegisterUserData> => {
    const url = `${API_BASE_URL}/auth/register`

    // Ensure dateOfBirth is valid ISO string (e.g. "2001-01-01T00:00:00.000Z")
    let isoDateOfBirth: string
    try {
      if (payload.dateOfBirth.includes('T')) {
        isoDateOfBirth = payload.dateOfBirth
      } else {
        const d = new Date(payload.dateOfBirth)
        isoDateOfBirth = isNaN(d.getTime())
          ? new Date('2000-01-01T00:00:00.000Z').toISOString()
          : d.toISOString()
      }
    } catch {
      isoDateOfBirth = new Date('2000-01-01T00:00:00.000Z').toISOString()
    }

    const requestBody: RegisterRequest = {
      displayName: payload.displayName.trim(),
      email: payload.email.trim(),
      password: payload.password,
      username: payload.username.trim().toLowerCase(),
      phoneNumber: payload.phoneNumber.trim(),
      dateOfBirth: isoDateOfBirth,
      userRole: 'user', // Always strictly 'user' for mobile app platform
    }

    let response: Response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
    } catch (networkError) {
      const msg = networkError instanceof Error ? networkError.message : 'Koneksi jaringan gagal'
      throw new Error(`Gagal terhubung ke server pendaftaran: ${msg}`)
    }

    let result: any
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      result = await response.json()
    } else {
      const text = await response.text()
      try {
        result = JSON.parse(text)
      } catch {
        result = { message: text || `HTTP Error ${response.status}` }
      }
    }

    if (!response.ok || result?.body?.isError || result?.isError) {
      let validationMsg = ''
      if (Array.isArray(result?.errors) && result.errors.length > 0) {
        validationMsg = result.errors
          .map((e: any) => e.message || `${e.path?.join('.') || 'Kolom'}: tidak valid`)
          .join(', ')
      }

      const errorMessage =
        validationMsg ||
        result?.body?.message ||
        result?.message ||
        `Pendaftaran akun gagal (Status ${response.status})`
      throw new Error(errorMessage)
    }

    const registeredUser: RegisterUserData = result?.body?.data || result?.data
    return registeredUser
  },

  /**
   * Mock / fallback register helper for offline / demo testing
   */
  registerDemo: (name: string, email: string, phone: string): UserProfile => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      points: 100,
      tripsCompleted: 0,
      joinedDate: 'November 2026',
    }
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newUser))
    localStorage.setItem(STORAGE_IS_LOGGED_IN_KEY, 'true')
    window.dispatchEvent(new Event('ayotrip_user_updated'))
    return newUser
  },

  /**
   * Get formatted user profile for display
   */
  getUser: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_PROFILE_KEY)
      if (data) return JSON.parse(data)
    } catch (e) {
      console.error(e)
    }
    return DEFAULT_USER
  },

  /**
   * Get raw backend login user data (including role, profile, permissions, etc.)
   */
  getAuthUser: (): LoginUserData | null => {
    try {
      const data = localStorage.getItem(STORAGE_AUTH_USER_KEY)
      if (data) return JSON.parse(data)
    } catch (e) {
      console.error(e)
    }
    return null
  },

  /**
   * Get access token for Bearer authentication
   */
  getAccessToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)
    } catch {
      return null
    }
  },

  /**
   * Get refresh token
   */
  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_REFRESH_TOKEN_KEY)
    } catch {
      return null
    }
  },

  /**
   * Check login state
   */
  isLoggedIn: (): boolean => {
    try {
      const state = localStorage.getItem(STORAGE_IS_LOGGED_IN_KEY)
      return state === 'true'
    } catch {
      return false
    }
  },

  /**
   * Update profile fields locally
   */
  updateProfile: (updated: Partial<UserProfile>): UserProfile => {
    const current = authService.getUser()
    const merged = { ...current, ...updated }
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(merged))
      window.dispatchEvent(new Event('ayotrip_user_updated'))
    } catch (e) {
      console.error(e)
    }
    return merged
  },

  /**
   * Logout and clear all tokens
   */
  logout: () => {
    try {
      localStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY)
      localStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY)
      localStorage.removeItem(STORAGE_AUTH_USER_KEY)
      localStorage.setItem(STORAGE_IS_LOGGED_IN_KEY, 'false')
      window.dispatchEvent(new Event('ayotrip_user_updated'))
    } catch (e) {
      console.error(e)
    }
  },

  /**
   * Helper to build Authorization header
   */
  getAuthHeaders: (): Record<string, string> => {
    const token = authService.getAccessToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
}
