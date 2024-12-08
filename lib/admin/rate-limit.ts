export class AdminRateLimit {
    private store: Map<string, { attempts: number, resetAt: number }>;
  
    constructor() {
      this.store = new Map();
    }
  
    async check(key: string, action: string, options: {
      maxAttempts: number;
      window: string;
    }) {
      const now = Date.now();
      const record = this.store.get(`${key}:${action}`);
  
      if (!record || record.resetAt < now) {
        this.store.set(`${key}:${action}`, {
          attempts: 1,
          resetAt: now + this.parseWindow(options.window)
        });
        return { success: true, remaining: options.maxAttempts - 1 };
      }
  
      if (record.attempts >= options.maxAttempts) {
        return { success: false, remaining: 0 };
      }
  
      record.attempts++;
      return { success: true, remaining: options.maxAttempts - record.attempts };
    }
  
    private parseWindow(window: string): number {
      const unit = window.slice(-1);
      const value = parseInt(window);
      
      switch(unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        default: return value;
      }
    }
  }
  
  export const adminRateLimit = new AdminRateLimit();