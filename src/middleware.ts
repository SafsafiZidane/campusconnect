import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const path = req.nextUrl.pathname;

  // Protected paths for logged-in users
  const isProtectedPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/requests/new") ||
    path.startsWith("/profile");

  // Admin only path
  const isAdminPath = path.startsWith("/admin");

  if ((isProtectedPath || isAdminPath) && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/requests/new", "/profile/:path*", "/admin/:path*"],
};
