import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();

function memoryLimit(
  key: string,
  limit: number,
  windowMs: number,
): { success: boolean; remaining: number } {
  const now = Date.now();
  const cur = memoryBuckets.get(key);
  if (!cur || cur.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (cur.count >= limit) {
    return { success: false, remaining: 0 };
  }
  cur.count += 1;
  return { success: true, remaining: limit - cur.count };
}

let redis: Redis | null = null;
const limiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

function getLimiter(name: string, limit: number, window: `${number} s` | `${number} m` | `${number} h`): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  const key = `${name}:${limit}:${window}`;
  let lim = limiters.get(key);
  if (!lim) {
    lim = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: `urte:${name}`,
    });
    limiters.set(key, lim);
  }
  return lim;
}

export async function rateLimit(opts: {
  key: string;
  limit: number;
  windowMs: number;
  name?: string;
}): Promise<{ success: boolean; remaining: number }> {
  const windowSec = Math.max(1, Math.round(opts.windowMs / 1000));
  const window =
    windowSec >= 3600
      ? (`${Math.round(windowSec / 3600)} h` as const)
      : windowSec >= 60
        ? (`${Math.round(windowSec / 60)} m` as const)
        : (`${windowSec} s` as const);

  const lim = getLimiter(opts.name ?? "default", opts.limit, window);
  if (!lim) {
    return memoryLimit(opts.key, opts.limit, opts.windowMs);
  }
  const res = await lim.limit(opts.key);
  return { success: res.success, remaining: res.remaining };
}

export const LIMITS = {
  loginIp: { limit: 5, windowMs: 60_000 },
  loginAccount: { limit: 10, windowMs: 3_600_000 },
  comments: { limit: 5, windowMs: 60_000 },
  votes: { limit: 60, windowMs: 60_000 },
  searchAnon: { limit: 60, windowMs: 60_000 },
  askSubmit: { limit: 2, windowMs: 86_400_000 },
  mcpAnon: { limit: 20, windowMs: 60_000 },
  bot: { limit: 30, windowMs: 60_000 },
} as const;
