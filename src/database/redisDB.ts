import { createClient, RedisClientType } from "redis";
import checkRedisClientConnection from "@/utils/redis/check-connection";

declare global {
  var redis: RedisClientType | undefined;
}

const redisClient: RedisClientType =
  globalThis.redis ||
  createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

if (!globalThis.redis) globalThis.redis = redisClient;

const initializeRedisConnection = async () => {
  try {
    await checkRedisClientConnection(redisClient);
    console.log("Redis client connected successfully!");
    // TODO: Handle redis emit events
  } catch (err) {
    throw new Error(
      "An error occurred while establishing connection with redis."
    );
  }
};

initializeRedisConnection();

export default redisClient;
