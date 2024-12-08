import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

// Rate limit for user login attempts
export const userLoginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  analytics: true,
  prefix: "@upstash/ratelimit:user:login",
})

// Rate limit for sending messages
export const messageSendLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 h"), // 50 messages per hour
  analytics: true,
  prefix: "@upstash/ratelimit:user:message",
})

// Rate limit for contact operations (add/update/delete)
export const contactOperationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "5 m"), // 20 operations per 5 minutes
  analytics: true,
  prefix: "@upstash/ratelimit:user:contact",
})

// Rate limit for template operations
export const templateOperationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 operations per minute
  analytics: true,
  prefix: "@upstash/ratelimit:user:template",
})

// Rate limit for API requests
export const userAPILimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  analytics: true,
  prefix: "@upstash/ratelimit:user:api",
})

export async function checkUserRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  try {
    const result = await limiter.limit(identifier)
    
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  } catch (error) {
    console.error("[USER_RATE_LIMIT_ERROR]", error)
    // Default to allowing the request in case of Redis errors
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    }
  }
}

export async function isUserRateLimited(
  limiter: Ratelimit,
  identifier: string
): Promise<boolean> {
  const { success } = await checkUserRateLimit(limiter, identifier)
  return !success
}
