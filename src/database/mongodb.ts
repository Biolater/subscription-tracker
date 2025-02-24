import mongoose from "mongoose";
import { DB_URI } from "../config/env.ts";

if (!DB_URI) {
    throw new Error("DB_URI is not defined");
};

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI!);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export { connectDB };