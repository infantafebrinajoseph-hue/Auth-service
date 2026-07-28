const { Redis } = require("@upstash/redis");

const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});

// The HTTP client holds no persistent connection, so there's nothing to
// connect. Kept as a no-op so existing boot code that awaits it still works.
const connectRedis = async () => {};

module.exports = {
    redisClient,
    connectRedis
};
