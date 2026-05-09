import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY } from "@/lib/auth";

const PUBLIC_ROUTES = new Set(["/login"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(ACCESS_TOKEN_KEY)?.value);
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);

  if (!hasToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
