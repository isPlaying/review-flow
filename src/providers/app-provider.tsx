"use client";

import { ConfigProvider, theme } from "antd";
import type { PropsWithChildren } from "react";

import { QueryProvider } from "./query-provider";

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1f6feb",
          borderRadius: 10,
        },
      }}
    >
      <QueryProvider>{children}</QueryProvider>
    </ConfigProvider>
  );
}
