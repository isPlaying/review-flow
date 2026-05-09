import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  raw?: unknown;
};

type UnauthorizedHandler = () => void;
type RetryableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
};

let unauthorizedHandler: UnauthorizedHandler | null = null;
// Shared refresh task to avoid issuing duplicate /auth/refresh requests in parallel.
let refreshPromise: Promise<void> | null = null;

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api",
  timeout: 10_000,
  // Cookie-only auth mode: backend sets HttpOnly cookies, frontend never stores tokens.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = http
      .post("/auth/refresh", undefined, {
        _skipAuthRefresh: true,
      } as RetryableRequestConfig)
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const requestConfig = (error.config ?? {}) as RetryableRequestConfig;
    const url = requestConfig.url ?? "";
    const isRefreshRequest = url.includes("/auth/refresh");
    const isLoginRequest = url.includes("/auth/login");
    const shouldTryRefresh =
      status === 401 &&
      !requestConfig._retry &&
      !requestConfig._skipAuthRefresh &&
      !isRefreshRequest &&
      !isLoginRequest;

    if (shouldTryRefresh) {
      // Retry once after refresh to recover from expired access tokens.
      requestConfig._retry = true;

      try {
        await refreshAccessToken();
        return await http.request(requestConfig);
      } catch {
        // Refresh failed: treat session as invalid and hand control to auth guard.
        unauthorizedHandler?.();
      }
    } else if (status === 401) {
      unauthorizedHandler?.();
    }

    const normalizedError: ApiError = {
      message: error.response?.data?.message ?? error.message ?? "Request failed",
      status,
      code: status === 401 ? "UNAUTHORIZED" : undefined,
      raw: error,
    };
    return Promise.reject(normalizedError);
  },
);
