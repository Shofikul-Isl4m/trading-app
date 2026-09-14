import { createClient, type RedisClientType } from "redis";

export const redis: RedisClientType = createClient({
    url: "redis://localhost:6379"
});

export default redis;