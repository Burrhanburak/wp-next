import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/about",
  "/contact",
];

/**
 * An array of routes that are authentication-related
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/resend-code",
  "/auth/verify",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/**
 * An array of routes that are admin authentication-related
 * @type {string[]}
 */
export const adminAuthRoutes = [
  "/admin/auth/login",
  "/admin/auth/verify",
];

/**
 * An array of routes that are only accessible to admin users
 * @type {string[]}
 */
export const adminRoutes = [
  "/admin",
  "/admin/dashboard",
  "/admin/users",
  "/admin/settings",
  "/admin/profile",
  "/admin/security",
];

/**
 * The default redirect path after admin login
 * @type {string}
 */
export const DEFAULT_ADMIN_REDIRECT = "/admin/dashboard";
