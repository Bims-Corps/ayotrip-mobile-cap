import { api, refreshApi } from "@/lib/axios";
import type { SuccessApiResponse, SuccessListApiResponse } from "@/types/core.type";
import type {
  AccountResponseListData,
  CheckTokenResponse,
  LoginResponse,
  ProfileResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
} from "@/types/auth.type";
import type { LoginSchemaType, RegisterSchemaType } from "@/types/auth.schema";

export const authApi = {
  signIn: async (payload: LoginSchemaType) => {
    const response = await api.post<SuccessApiResponse<LoginResponse>>(
      "/auth/login",
      payload,
    );
    return response.data;
  },
  signOut: async () => {
    try {
      const response = await api.post<SuccessApiResponse<unknown>>("/auth/logout");
      return response.data;
    } catch {
      // Best-effort logout on client side
      return null;
    }
  },
  signUp: async (payload: RegisterSchemaType) => {
    const response = await api.post<SuccessApiResponse<unknown>>(
      "/auth/register",
      payload,
    );
    return response.data;
  },
  profile: async () => {
    const { data } = await api.get<SuccessApiResponse<ProfileResponse>>("/auth/profile");
    return data;
  },
  refreshToken: async (payload: RefreshTokenPayload) => {
    const response = await refreshApi.post<SuccessApiResponse<RefreshTokenResponse>>(
      "/auth/refresh",
      payload,
    );
    return response.data;
  },
  checkToken: async () => {
    const { data } = await api.get<SuccessApiResponse<CheckTokenResponse>>(
      "/auth/check-token",
    );
    return data;
  },
};

export default authApi;
