const { redisClient } = require("../config/redis");

const SESSION_TTL_SECONDS =
    parseInt(process.env.SESSION_TTL_SECONDS, 10) || 24 * 60 * 60;

const getSessionKey = (userId) => `session:${userId}`;

const isRedisAvailable = () =>
    Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const storeSession = async (userId, token) => {
    try {
        await redisClient.set(getSessionKey(userId), token, { ex: SESSION_TTL_SECONDS });
    } catch (error) {
        console.warn("storeSession failed:", error.message);
    }
};

const getSession = async (userId) => {
    try {
        return await redisClient.get(getSessionKey(userId));
    } catch (error) {
        console.warn("getSession failed:", error.message);
        return null;
    }
};

const deleteSession = async (userId) => {
    try {
        await redisClient.del(getSessionKey(userId));
    } catch (error) {
        console.warn("deleteSession failed:", error.message);
    }
};

module.exports = {
    storeSession,
    getSession,
    deleteSession,
    isRedisAvailable,
    SESSION_TTL_SECONDS
};
