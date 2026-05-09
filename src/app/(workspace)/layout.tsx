import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { DashboardShell } from "@/features/layout/dashboard-shell";
import { ACCESS_TOKEN_KEY } from "@/lib/auth";

export default async function WorkspaceLayout({ children }: PropsWithChildren) {
  const token = (await cookies()).get(ACCESS_TOKEN_KEY)?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
