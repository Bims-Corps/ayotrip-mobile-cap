import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINT } from "@/utils/config";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  removeAllAuthTokens,
} from "@/utils/token";
import { toast } from "sonner";
import type { SuccessApiResponse } from "@/types/core.type";
import type { RefreshTokenResponse } from "@/types/auth.type";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

export const api = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000,
  withCredentials: true,
  paramsSerializer: {
    indexes: null,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

export const refreshApi = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    if (typeof config.headers?.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh");

    if (isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      removeAllAuthTokens();
      toast.error("Sesi Berakhir", {
        description: "Sesi Anda telah berakhir. Silakan masuk kembali.",
      });

      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          const redirectPath = encodeURIComponent(
            window.location.pathname + window.location.search,
          );
          window.location.href = `/login?redirect=${redirectPath}`;
        }
      }

      return Promise.reject(error);
    }

    const currentAccessToken = getAccessToken();
    const existingAuthHeader =
      typeof originalRequest.headers?.get === "function"
        ? (originalRequest.headers.get("Authorization") as string | undefined)
        : (originalRequest.headers?.Authorization as string | undefined);

    if (
      currentAccessToken &&
      existingAuthHeader &&
      existingAuthHeader !== `Bearer ${currentAccessToken}`
    ) {
      if (typeof originalRequest.headers.set === "function") {
        originalRequest.headers.set("Authorization", `Bearer ${currentAccessToken}`);
      } else {
        originalRequest.headers.Authorization = `Bearer ${currentAccessToken}`;
      }
      return api(originalRequest);
    }

    if (isRefreshing) {
      let resolvePromise!: (token: string) => void;
      let rejectPromise!: (error: unknown) => void;
      const promise = new Promise<string>((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
      });

      failedQueue.push({ resolve: resolvePromise, reject: rejectPromise });
      return promise
        .then((newAccessToken: string) => {
          if (typeof originalRequest.headers.set === "function") {
            originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
          } else {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return api(originalRequest);
        })
        .catch((queueError: unknown) => {
          return Promise.reject(queueError);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await refreshApi.post<SuccessApiResponse<RefreshTokenResponse>>(
        "/auth/refresh",
        { refreshToken },
      );

      const newAccessToken = response.data?.body?.data?.accessToken;
      if (!newAccessToken) {
        throw new Error("Access token missing in refresh response");
      }

      setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);

      if (typeof originalRequest.headers.set === "function") {
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
      } else {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      removeAllAuthTokens();

      toast.error("Sesi Berakhir", {
        description: "Sesi Anda telah berakhir. Silakan masuk kembali.",
      });

      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          const redirectPath = encodeURIComponent(
            window.location.pathname + window.location.search,
          );
          window.location.href = `/login?redirect=${redirectPath}`;
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
