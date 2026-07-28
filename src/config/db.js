const mongoose = require("mongoose");

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
    if (cached.conn && cached.conn.connection.readyState === 1) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 5,
                bufferCommands: false
            })
            .then((m) => {
                console.log("MongoDB Connected");
                return m;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("MongoDB connection failed:", error);
        throw error;
    }

    return cached.conn;
};

module.exports = connectDB;
