const authService = require("../services/auth.service");

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.signup(email, password);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const result = await authService.logout(req.user.id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const result = await authService.getProfile(req.user.id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const verify = async (req, res, next) => {
    try {
        const result = await authService.verify(req.user.id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    login,
    logout,
    getMe,
    verify
};
