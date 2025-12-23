import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Next.js Middleware for Route Protection
 *
 * Provides first-line defense for admin routes.
 * This runs at the edge before the page even loads.
 *
 * Note: Role check happens in the layout for full database access.
 * This middleware handles session validation only.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes require authentication
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/orders")
  ) {
    try {
      // Check for session using Better Auth
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      // No session = redirect to login
      if (!session?.user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        loginUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(loginUrl);
      }

      // Session exists - allow through (role check happens in layout)
      return NextResponse.next();
    } catch {
      // Auth check failed - redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Admin routes
    "/dashboard/:path*",
    "/products/:path*",
    "/orders/:path*",
  ],
};
