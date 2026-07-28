const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const AppError = require("./utils/AppError");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Ensure DB/Redis are connected before any route that needs them.
// No-op once warm; only does real work on a cold instance.
app.use(async (req, res, next) => {
    try {
        await Promise.all([connectDB(), connectRedis()]);
        next();
    } catch (error) {
        next(new AppError("Service dependencies unavailable", 503));
    }
});

app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message:
                'Invalid JSON body. Use double quotes, e.g. {"email":"user@example.com","password":"secret"}'
        });
    }
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Internal server error";
    if (!err.isOperational) {
        console.error(err);
    }
    res.status(statusCode).json({ message });
});

module.exports = app;
