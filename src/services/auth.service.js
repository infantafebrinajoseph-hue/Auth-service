const bcrypt = require("bcrypt");

const userRepository = require("../repositories/user.repository");
const { generateToken } = require("../utils/jwt");
const { storeSession, deleteSession } = require("../utils/session");
const AppError = require("../utils/AppError");

const SALT_ROUNDS = 10;

const signup = async (email, password) => {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new AppError("Account already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await userRepository.create({
        email,
        password: hashedPassword
    });

    const token = generateToken(user);
    await storeSession(user._id, token);

    return {
        message: "Signup successful",
        token,
        user: {
            id: user._id,
            email: user.email
        }
    };
};

const login = async (email, password) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user);
    await storeSession(user._id, token);

    return {
        message: "Login successful",
        token,
        user: {
            id: user._id,
            email: user.email
        }
    };
};

const logout = async (userId) => {
    await deleteSession(userId);

    return {
        message: "Logout successful"
    };
};

const getProfile = async (userId) => {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return {
        user
    };
};

const verify = async (userId) => {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return {
        user: {
            id: user._id,
            email: user.email
        }
    };
};

module.exports = {
    signup,
    login,
    logout,
    getProfile,
    verify
};
