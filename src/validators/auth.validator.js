const AppError = require("../utils/AppError");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const validateBody = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return next(
            new AppError(
                "Request body is required. Send JSON with Content-Type: application/json",
                400
            )
        );
    }

    next();
};

const validateSignup = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Email and password are required", 400));
    }

    if (typeof email !== "string" || typeof password !== "string") {
        return next(new AppError("Email and password must be strings", 400));
    }

    if (!EMAIL_REGEX.test(email)) {
        return next(new AppError("Invalid email format", 400));
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        return next(
            new AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400)
        );
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Email and password are required", 400));
    }

    if (typeof email !== "string" || typeof password !== "string") {
        return next(new AppError("Email and password must be strings", 400));
    }

    next();
};

const validateRefreshToken = (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError("Refresh token is required", 400));
    }

    next();
};

module.exports = {
    validateBody,
    validateSignup,
    validateLogin,
    validateRefreshToken
};
