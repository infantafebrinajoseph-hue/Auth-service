const jwt = require("jsonwebtoken");

const JWT_EXPIRY = process.env.JWT_EXPIRY || "1d";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: JWT_EXPIRY
        }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
    generateAccessToken: generateToken,
    verifyAccessToken: verifyToken
};
