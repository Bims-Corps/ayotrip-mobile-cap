import { authApi } from "@/services/authApi";
import { API_ENDPOINT } from "@/utils/config";
import {
  getAccessToken,
  getRefreshToken,
  setAllAuthTokens,
  removeAllAuthTokens,
  STORAGE_KEYS,
} from "@/utils/token";
import type {
  LoginResponse,
  ProfileResponse,
} from "@/types/auth.type";
import type { LoginSchemaType, RegisterSchemaType } from "@/types/auth.schema";

export const API_BASE_URL = API_ENDPOINT;

// Backwards-compatible interfaces with ayotrip-web-tanstart schema
export type LoginRequest = LoginSchemaType;
export type RegisterRequest = RegisterSchemaType;
export type LoginUserData = LoginResponse;
export type RegisterUserData = any;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  username?: string;
  role?: string;
  membershipTier: 'Silver Adventurer' | 'Gold Explorer' | 'Platinum Voyager';
  points: number;
  tripsCompleted: number;
  joinedDate: string;
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
  joinedDate: 'Januari 2025',
};

export const authService = {
  /**
   * Hit endpoint POST /auth/login with { email, password }
   * Powered by core axios client with automatic token interceptors
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await authApi.signIn({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      const loginData = response?.body?.data;
      if (!loginData || !loginData.accessToken) {
        throw new Error(response?.body?.message || 'Data autentikasi dari server tidak valid.');
      }

      // Persist tokens securely
      setAllAuthTokens(loginData.accessToken, loginData.refreshToken);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(loginData));

      // Map to application UserProfile
      const mappedProfile: UserProfile = {
        id: loginData.id,
        name:
          loginData.profile?.displayName ||
          loginData.username ||
          loginData.email.split('@')[0],
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
      };

      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(mappedProfile));
      window.dispatchEvent(new Event('ayotrip_user_updated'));

      return loginData;
    } catch (error: any) {
      const respData = error?.response?.data;
      const errorMessage =
        respData?.body?.message ||
        respData?.message ||
        (error?.response?.status === 401
          ? 'Email atau kata sandi tidak cocok'
          : error?.message || 'Login gagal.');
      throw new Error(errorMessage);
    }
  },

  /**
   * Hit endpoint POST /auth/register
   * Payload: { displayName, email, password, username, phoneNumber, dateOfBirth, userRole: 'user' }
   */
  register: async (payload: any): Promise<any> => {
    let isoDateOfBirth: string | undefined = undefined;
    if (payload.dateOfBirth) {
      try {
        if (payload.dateOfBirth.includes('T')) {
          isoDateOfBirth = payload.dateOfBirth;
        } else {
          const d = new Date(payload.dateOfBirth);
          isoDateOfBirth = isNaN(d.getTime())
            ? new Date('2000-01-01T00:00:00.000Z').toISOString()
            : d.toISOString();
        }
      } catch {
        isoDateOfBirth = new Date('2000-01-01T00:00:00.000Z').toISOString();
      }
    }

    const requestBody: any = {
      displayName: payload.displayName?.trim(),
      email: payload.email?.trim(),
      password: payload.password,
      username: payload.username?.trim().toLowerCase(),
      phoneNumber: payload.phoneNumber?.trim(),
      userRole: payload.userRole || 'user',
    };

    if (isoDateOfBirth) {
      requestBody.dateOfBirth = isoDateOfBirth;
    }

    try {
      const response = await authApi.signUp(requestBody);
      const data = (response as any)?.body?.data || (response as any)?.data || requestBody;
      return data;
    } catch (error: any) {
      const respData = error?.response?.data;
      let validationMsg = '';
      if (Array.isArray(respData?.errors) && respData.errors.length > 0) {
        validationMsg = respData.errors
          .map((e: any) => e.message || `${e.path?.join('.') || 'Kolom'}: tidak valid`)
          .join(', ');
      }

      const errorMessage =
        validationMsg ||
        respData?.body?.message ||
        respData?.message ||
        error?.message ||
        'Pendaftaran akun gagal.';
      throw new Error(errorMessage);
    }
  },

  /**
   * Fetch authenticated user profile directly from GET /auth/profile
   */
  fetchServerProfile: async (): Promise<ProfileResponse | null> => {
    try {
      const res = await authApi.profile();
      const profileData = res?.body?.data;
      if (profileData) {
        const currentUser = authService.getUser();
        const updatedProfile: UserProfile = {
          ...currentUser,
          id: profileData.account?.id || profileData.accountId,
          name: profileData.displayName || currentUser.name,
          email: profileData.account?.email || currentUser.email,
          phone: profileData.account?.phoneNumber || currentUser.phone,
          avatar: profileData.avatarUrl || currentUser.avatar,
          username: profileData.account?.username || currentUser.username,
          role: profileData.account?.role?.name || currentUser.role,
        };
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
        window.dispatchEvent(new Event('ayotrip_user_updated'));
      }
      return profileData;
    } catch (e) {
      console.error('Failed to fetch server profile:', e);
      return null;
    }
  },

  /**
   * Demo / mock login helper for offline / demo testing
   */
  loginDemo: (email = 'userprovown1@gmail.com', name = 'Provider Owner 1'): UserProfile => {
    const mockUserData: LoginResponse = {
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
    };

    setAllAuthTokens(mockUserData.accessToken, mockUserData.refreshToken);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(mockUserData));

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
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
    window.dispatchEvent(new Event('ayotrip_user_updated'));
    return user;
  },

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
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    window.dispatchEvent(new Event('ayotrip_user_updated'));
    return newUser;
  },

  getUser: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER;
  },

  getAuthUser: (): LoginResponse | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return null;
  },

  getAccessToken: (): string | null => {
    return getAccessToken();
  },

  getRefreshToken: (): string | null => {
    return getRefreshToken();
  },

  isLoggedIn: (): boolean => {
    try {
      const state = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      return state === 'true' && Boolean(getAccessToken());
    } catch {
      return false;
    }
  },

  updateProfile: (updated: Partial<UserProfile>): UserProfile => {
    const current = authService.getUser();
    const merged = { ...current, ...updated };
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(merged));
      window.dispatchEvent(new Event('ayotrip_user_updated'));
    } catch (e) {
      console.error(e);
    }
    return merged;
  },

  logout: async () => {
    await authApi.signOut();
    removeAllAuthTokens();
  },

  getAuthHeaders: (): Record<string, string> => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
