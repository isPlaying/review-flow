import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";

import { AppProvider } from "@/providers/app-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Frontend Starter",
  description: "Next.js + TypeScript + TanStack Query + RHF + Zustand + Ant Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <AntdRegistry>
          <AppProvider>{children}</AppProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
