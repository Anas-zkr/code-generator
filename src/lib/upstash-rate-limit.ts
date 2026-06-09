import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimit instance
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 d"), // 5 requests per day
  analytics: true, // Enable analytics dashboard
  prefix: "ratelimit:codegen", // Optional: prefix for keys
});