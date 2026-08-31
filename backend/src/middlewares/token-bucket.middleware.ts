import type { Request, Response, NextFunction } from "express";

interface Bucket {
    tokens: number;
    lastRefill: number;
}

interface TokenBucketOptions {
    capacity: number;
    refillRate: number;
}

export function tokenBucketRateLimit(
    options: TokenBucketOptions
) {
    const { capacity, refillRate } = options;

    const buckets = new Map<string, Bucket>();

    return (req: Request, res: Response, next: NextFunction) => {
        const clientId = req.ip;


if (!clientId) {
    return res.status(400).json({
        success: false,
        message: "Unable to identify client",
    });
}

        const now = Date.now() / 1000;

        let bucket = buckets.get(clientId);

        // First request from this client
        if (!bucket) {
            bucket = {
                tokens: capacity,
                lastRefill: now,
            };

            buckets.set(clientId, bucket);
        }

        // Calculate elapsed time
        const elapsed = now - bucket.lastRefill;

        // Refill tokens
        bucket.tokens = Math.min(
            capacity,
            bucket.tokens + elapsed * refillRate
        );

        bucket.lastRefill = now;

        // Check if request is allowed
        if (bucket.tokens < 1) {
            return res.status(429).json({
                success: false,
                message: "Too many requests",
            });
        }

        // Consume one token
        bucket.tokens -= 1;

        next();
    };
}

export const loginLimiter = tokenBucketRateLimit({
  capacity: 5,
  refillRate: 5 / 60,
});

export const registerLimiter = tokenBucketRateLimit({
  capacity: 3,
  refillRate: 3 / 60,
});

/**
 * Limits how often a client can request a password-reset OTP.
 *
 * Kept intentionally strict (3 requests / 10 minutes) since each
 * request sends an email — this is the main defense against
 * someone spamming a victim's inbox with reset codes.
 */
export const forgotPasswordLimiter = tokenBucketRateLimit({
  capacity: 3,
  refillRate: 3 / (10 * 60),
});

/**
 * Limits how often a client can attempt to verify/consume an OTP.
 *
 * This is a second layer on top of the per-OTP `attempts` counter
 * in the database — that counter protects a single code, this
 * protects against a client hammering the endpoint across
 * multiple requested codes.
 */
export const resetPasswordLimiter = tokenBucketRateLimit({
  capacity: 8,
  refillRate: 8 / (10 * 60),
});
