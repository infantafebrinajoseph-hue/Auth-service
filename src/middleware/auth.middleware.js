const { verifyToken } = require("../utils/jwt");
const { getSession } = require("../utils/session");
const AppError = require("../utils/AppError");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Access token is required", 401);
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        const activeSession = await getSession(decoded.id);

        if (!activeSession || activeSession !== token) {
            throw new AppError("Session expired or invalid", 401);
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new AppError("Token expired", 401));
        }

        if (error.name === "JsonWebTokenError") {
            return next(new AppError("Invalid token", 401));
        }

        next(error);
    }
};

module.exports = {
    authenticate
};
