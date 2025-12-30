/**
 * Rate Limiter
 *
 * Simple in-memory rate limiting for auth endpoints.
 * In production, use Redis for distributed rate limiting.
 *
 * Features:
 * - Configurable attempts per window
 * - Automatic cleanup of expired entries
 * - IP-based or user-based limiting
 */

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
}

interface RateLimiterConfig {
  maxAttempts: number;
  windowMs: number;
}

// Default configs for different scenarios
export const RATE_LIMIT_CONFIGS = {
  // Auth endpoints: 5 attempts per 15 minutes
  auth: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },

  // General API: 100 requests per minute
  api: { maxAttempts: 100, windowMs: 60 * 1000 },

  // Password reset: 3 attempts per hour
  passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
} as const;

export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly config: RateLimiterConfig;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: RateLimiterConfig) {
    this.config = config;
    this.startCleanup();
  }

  /**
   * Check if a key (IP, user ID, etc.) is rate limited
   * Returns true if the request should be blocked
   */
  isLimited(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry) {
      return false;
    }

    // Check if window has expired
    if (now - entry.firstAttempt > this.config.windowMs) {
      this.store.delete(key);
      return false;
    }

    return entry.attempts >= this.config.maxAttempts;
  }

  /**
   * Record an attempt for a key
   * Call this BEFORE processing the request
   */
  recordAttempt(key: string): {
    allowed: boolean;
    remaining: number;
    resetIn: number;
  } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now - entry.firstAttempt > this.config.windowMs) {
      // Start new window
      this.store.set(key, { attempts: 1, firstAttempt: now });
      return {
        allowed: true,
        remaining: this.config.maxAttempts - 1,
        resetIn: this.config.windowMs,
      };
    }

    // Existing window
    entry.attempts++;
    this.store.set(key, entry);

    const remaining = Math.max(0, this.config.maxAttempts - entry.attempts);
    const resetIn = this.config.windowMs - (now - entry.firstAttempt);

    return {
      allowed: entry.attempts <= this.config.maxAttempts,
      remaining,
      resetIn,
    };
  }

  /**
   * Reset rate limit for a key (e.g., after successful login)
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Get info about a key's rate limit status
   */
  getStatus(
    key: string
  ): { attempts: number; remaining: number; resetIn: number } | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    const resetIn = Math.max(
      0,
      this.config.windowMs - (now - entry.firstAttempt)
    );
    const remaining = Math.max(0, this.config.maxAttempts - entry.attempts);

    return {
      attempts: entry.attempts,
      remaining,
      resetIn,
    };
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(): void {
    // Clean up every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now - entry.firstAttempt > this.config.windowMs) {
          this.store.delete(key);
        }
      }
    }, 60 * 1000);
  }

  /**
   * Stop the cleanup interval (for testing/shutdown)
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instances for common use cases
export const authRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.auth);
export const apiRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.api);
export const passwordResetRateLimiter = new RateLimiter(
  RATE_LIMIT_CONFIGS.passwordReset
);

/**
 * Helper to get client IP from request headers
 */
export function getClientIp(headers: Headers): string {
  // Check common proxy headers
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback
  return "unknown";
}
