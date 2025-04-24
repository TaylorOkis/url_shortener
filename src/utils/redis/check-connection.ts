import { RedisClientType } from "redis";

const checkRedisClientConnection = async (redisClient: RedisClientType) => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default checkRedisClientConnection;
