import type { AxiosError } from "axios";
import axios from "axios";

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  raw?: unknown;
};

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
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

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;

    if (status === 401) {
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
