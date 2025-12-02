import { Redis } from '@upstash/redis';

let redisClient: Redis;

function getRedisClient() {
  if (!redisClient) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Missing Redis configuration. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.');
    }
    
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redisClient;
}

export async function setOTP(email: string, otp: string) {
  const redis = getRedisClient();
  const key = `otp:${email.toLowerCase().trim()}`;
  const otpString = otp.toString().trim();
  console.log(`Setting OTP for ${key}`);
  await redis.setex(key, 330, otpString);
  return otpString;
}

export async function getOTP(email: string): Promise<string | null> {
  const redis = getRedisClient();
  const key = `otp:${email.toLowerCase().trim()}`;
  const otp = await redis.get(key);
  return otp ? otp.toString().trim() : null;
}

export async function deleteOTP(email: string) {
  const redis = getRedisClient();
  const key = `otp:${email.toLowerCase().trim()}`;
  await redis.del(key);
}

export const redis = getRedisClient();