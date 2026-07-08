const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");
const { authenticate } = require("../middleware/auth.middleware");

router.post(
    "/signup",
    authValidator.validateBody,
    authValidator.validateSignup,
    authController.signup
);

router.post(
    "/login",
    authValidator.validateBody,
    authValidator.validateLogin,
    authController.login
);

router.post("/logout", authenticate, authController.logout);

router.get("/me", authenticate, authController.getMe);

router.get("/verify", authenticate, authController.verify);

module.exports = router;
