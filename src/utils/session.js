const { redisClient } = require("../config/redis");

const SESSION_TTL_SECONDS =
    parseInt(process.env.SESSION_TTL_SECONDS, 10) || 24 * 60 * 60;

const getSessionKey = (userId) => `session:${userId}`;

const storeSession = async (userId, token) => {
    await redisClient.setEx(
        getSessionKey(userId),
        SESSION_TTL_SECONDS,
        token
    );
};

const getSession = async (userId) => {
    return redisClient.get(getSessionKey(userId));
};

const deleteSession = async (userId) => {
    await redisClient.del(getSessionKey(userId));
};

module.exports = {
    storeSession,
    getSession,
    deleteSession,
    SESSION_TTL_SECONDS
};
