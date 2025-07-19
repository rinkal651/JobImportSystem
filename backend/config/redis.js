// config/redis.js
import Redis from 'ioredis';

export const redisConnection = new Redis({
    host: 'redis-11323.crce179.ap-south-1-1.ec2.redns.redis-cloud.com:11323',
    port: 11323,
    password: 'Rinkal@123',
    tls: {}, // required for Redis Cloud SSL
});
