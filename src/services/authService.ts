export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
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

const STORAGE_KEY = 'ayotrip_user_profile'
const AUTH_KEY = 'ayotrip_is_logged_in'

export const authService = {
  getUser: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) return JSON.parse(data)
    } catch (e) {
      console.error(e)
    }
    return DEFAULT_USER
  },

  isLoggedIn: (): boolean => {
    try {
      const state = localStorage.getItem(AUTH_KEY)
      return state !== 'false'
    } catch {
      return true
    }
  },

  updateProfile: (updated: Partial<UserProfile>): UserProfile => {
    const current = authService.getUser()
    const merged = { ...current, ...updated }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      window.dispatchEvent(new Event('ayotrip_user_updated'))
    } catch (e) {
      console.error(e)
    }
    return merged
  },

  login: (email: string, name?: string): UserProfile => {
    const user = {
      ...authService.getUser(),
      email,
      name: name || email.split('@')[0],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(AUTH_KEY, 'true')
    window.dispatchEvent(new Event('ayotrip_user_updated'))
    return user
  },

  register: (name: string, email: string, phone: string): UserProfile => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      points: 100,
      tripsCompleted: 0,
      joinedDate: 'Oktober 2026'
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    localStorage.setItem(AUTH_KEY, 'true')
    window.dispatchEvent(new Event('ayotrip_user_updated'))
    return newUser
  },

  logout: () => {
    localStorage.setItem(AUTH_KEY, 'false')
    window.dispatchEvent(new Event('ayotrip_user_updated'))
  }
}

