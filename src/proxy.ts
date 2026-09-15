import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const ADMIN_PREFIX = "/admin";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const role = request.cookies.get("role")?.value;

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);

  /**
   * Protect Admin Routes
   */
  if (isAdminRoute) {
    if (!role) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    if (role !== "Admin") {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    return NextResponse.next();
  }

  /**
   * Admin should NEVER access ecommerce pages
   */
  if (
    role === "Admin" &&
    !isAdminRoute &&
    !isAuthRoute
  ) {
    return NextResponse.redirect(
      new URL("/admin", request.url)
    );
  }

  /**
   * Logged-in users shouldn't access login/register pages
   */
  if (role && isAuthRoute) {
    if (role === "Admin") {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|assets|.*\\..*).*)",
  ],
};