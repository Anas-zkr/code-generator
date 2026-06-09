import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Free tier: 5 requests per day
export const freeTierRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 d"),
  analytics: true,
  prefix: "ratelimit:free",
});

// Premium tier: 100 requests per day
export const premiumTierRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 d"),
  analytics: true,
  prefix: "ratelimit:premium",
});