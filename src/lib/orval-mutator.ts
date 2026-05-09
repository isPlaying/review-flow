import type { AxiosRequestConfig } from "axios";

import { http } from "@/lib/http";

function tryParseBody(body: BodyInit | null | undefined) {
  if (typeof body !== "string") {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

export const customInstance = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const config: AxiosRequestConfig = {
    url,
    method: (options?.method as AxiosRequestConfig["method"]) ?? "GET",
    headers: options?.headers as AxiosRequestConfig["headers"],
    data: tryParseBody(options?.body),
    signal: options?.signal ?? undefined,
  };

  const response = await http.request<T>(config);
  return response.data;
};
