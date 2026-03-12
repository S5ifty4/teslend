/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Resets per Vercel serverless function instance lifetime.
 * Good enough for abuse prevention on low-traffic routes.
 *
 * Usage:
 *   const allowed = rateLimit(ip, 'inquiries', 5, 60_000); // 5 req/min
 *   if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 */

interface BucketEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, BucketEntry>();

export function rateLimit(
  identifier: string,
  namespace: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const key = `${namespace}:${identifier}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;

  entry.count += 1;
  return true;
}

/** Extract client IP from Next.js request headers (Vercel sets x-forwarded-for) */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}
