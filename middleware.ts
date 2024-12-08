import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/db";

// Define routes that don't require authentication
const publicRoutes = ["/", "/about", "/contact"];
const authRoutes = [
  "/admin/auth/login",
  "/admin/auth/verify",
  "/admin/auth/verify-sms"
];
const apiRoutes = ["/api"];

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
});

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Allow API routes
  if (apiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 3. Handle admin routes
  if (pathname.startsWith("/admin")) {
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    
    // Allow access to auth routes even without session
    if (isAuthRoute) {
      return NextResponse.next();
    }

    // If no session or not admin, redirect to login
    if (!session?.user || session.user.role !== "ADMIN") {
      const redirectUrl = new URL("/admin/auth/login", request.url);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if admin needs verification
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email! }
    });

    if (!admin?.verified && !pathname.startsWith("/admin/auth/verify")) {
      return NextResponse.redirect(new URL("/admin/auth/verify", request.url));
    }

    return NextResponse.next();
  }

  // 4. Handle user routes
  if (pathname.startsWith("/dashboard")) {
    if (!session?.user) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/:path*"
  ]
}