export type RoleType =
  | "user"
  | "travel_agent_manager"
  | "travel_agent_member"
  | "admin";

export interface UserRole {
  id: string;
  name: string;
  description: string;
  type: string;
}

export interface UserProfileData {
  id: string;
  accountId: string;
  displayName: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  bio: string | null;
  preference: string | null;
  createdAt: string;
  updatedAt: string;
  currentLocation: string | null;
}

export interface LoginResponse {
  id: string;
  email: string;
  username: string;
  phoneNumber: string;
  isTravelAgentProvider: boolean;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  bannedReason: string | null;
  lastLogin: string | null;
  lastLoginIp: string | null;
  failedAttempts: number;
  lockedUntil: string | null;
  createdAt: string;
  updatedAt: string;
  roleId: string;
  role: UserRole;
  profile: UserProfileData;
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  id: string;
  accountId: string;
  displayName: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  bio: string | null;
  preference: string | null;
  createdAt: string;
  updatedAt: string;
  currentLocation: string | null;
  account: {
    id: string;
    email: string;
    username: string;
    phoneNumber: string;
    isTravelAgentProvider: boolean;
    isActive: boolean;
    isVerified: boolean;
    isBanned: boolean;
    bannedReason: string | null;
    lastLogin: string | null;
    lastLoginIp: string | null;
    failedAttempts: number;
    lockedUntil: string | null;
    createdAt: string;
    updatedAt: string;
    roleId: string;
    role: UserRole;
  };
}

export interface AccountResponseListData {
  id: string;
  email: string;
  username: string;
  phoneNumber: string;
  isTravelAgentProvider: boolean;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  bannedReason?: string;
  lastLogin?: string;
  lastLoginIp?: string;
  failedAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
  roleId: string;
  profile: {
    displayName: string;
    avatarUrl?: string;
  };
  role: {
    id: string;
    name: string;
    description: string;
    type: string;
  };
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface CheckTokenResponse {
  userId: string;
  username: string;
  roleId: string;
  exp: number;
  iat: number;
}
