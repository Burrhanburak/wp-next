import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getClientIp(headers: Headers): string {
  // Try X-Forwarded-For header first (common for proxies)
  const forwardedFor = headers.get("x-forwarded-for")
  if (forwardedFor) {
    // Get the first IP in the list (client's original IP)
    return forwardedFor.split(",")[0].trim()
  }

  // Try X-Real-IP header (used by some proxies)
  const realIp = headers.get("x-real-ip")
  if (realIp) {
    return realIp.trim()
  }

  // Fallback to a placeholder if no IP found
  return "0.0.0.0"
}
