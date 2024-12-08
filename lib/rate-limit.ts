import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface RateLimitConfig {
  maxRequests: number;
  window: number;
  blockDuration?: number;
}

// Önceden tanımlanmış limit konfigürasyonları
export const RATE_LIMIT_CONFIGS = {
  LOGIN: {
    maxRequests: 5,
    window: 300,        // 5 dakika
    blockDuration: 1800 // 30 dakika block
  },
  SMS: {
    maxRequests: 3,
    window: 600,        // 10 dakika
    blockDuration: 3600 // 1 saat block
  },
  API: {
    maxRequests: 100,
    window: 60,         // 1 dakika
    blockDuration: 300  // 5 dakika block
  }
} as const;

class RateLimit {
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { 
      maxRequests: 5,
      window: 300,
      blockDuration: 1800,
      ...config 
    };
  }

  async check(key: string, customConfig?: Partial<RateLimitConfig>): Promise<{ 
    success: boolean; 
    remaining: number;
    blocked: boolean;
    resetAt?: Date;
  }> {
    const config = { ...this.config, ...customConfig };
    const now = Math.floor(Date.now() / 1000);
    const windowKey = `${key}:${Math.floor(now / config.window)}`;
    const blockKey = `${key}:blocked`;

    try {
      // Block kontrolü
      const isBlocked = await redis.get(blockKey);
      if (isBlocked) {
        const ttl = await redis.ttl(blockKey);
        return {
          success: false,
          remaining: 0,
          blocked: true,
          resetAt: new Date(Date.now() + ttl * 1000)
        };
      }

      // İstek sayısını artır
      const requests = await redis.incr(windowKey);
      
      // İlk istek ise süreyi ayarla
      if (requests === 1) {
        await redis.expire(windowKey, config.window);
      }

      // Limit kontrolü
      if (requests > config.maxRequests) {
        if (config.blockDuration) {
          await redis.set(blockKey, '1', { ex: config.blockDuration });
        }
        return {
          success: false,
          remaining: 0,
          blocked: true,
          resetAt: new Date(Date.now() + config.blockDuration! * 1000)
        };
      }

      return {
        success: true,
        remaining: config.maxRequests - requests,
        blocked: false
      };

    } catch (error) {
      console.error('Rate limit error:', error);
      // Hata durumunda izin ver
      return {
        success: true,
        remaining: 1,
        blocked: false
      };
    }
  }

  async reset(key: string): Promise<void> {
    const blockKey = `${key}:blocked`;
    await redis.del(blockKey);
  }
}

// Önceden yapılandırılmış rate limiter'lar
export const loginRateLimit = new RateLimit(RATE_LIMIT_CONFIGS.LOGIN);
export const smsRateLimit = new RateLimit(RATE_LIMIT_CONFIGS.SMS);
export const apiRateLimit = new RateLimit(RATE_LIMIT_CONFIGS.API);
