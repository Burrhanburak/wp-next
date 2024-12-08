import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL|| !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Redis credentials')
}
const redis = Redis.fromEnv();
// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_URL,
//   token: process.env.UPSTASH_REDIS_TOKEN,
// })

// Cache verification code with expiration
export async function cacheVerificationCode(userId: string, code: string) {
  const key = `verify:${userId}`
  await redis.set(key, code, { ex: 300 }) // Expires in 5 minutes
}

// Get cached verification code
export async function getVerificationCode(userId: string): Promise<string | null> {
  const key = `verify:${userId}`
  return redis.get(key)
}

// Delete verification code
export async function deleteVerificationCode(userId: string) {
  const key = `verify:${userId}`
  await redis.del(key)
}

// Rate limiting
export async function checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
  const count = await redis.incr(key)
  
  if (count === 1) {
    await redis.expire(key, window)
  }
  
  return count <= limit
}
