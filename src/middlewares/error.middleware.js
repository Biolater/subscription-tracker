import mongoose from "mongoose";

export class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorMiddleware = (err, req, res, next) => {
    let error = {
        name: "Error",
        message: "Something went wrong",
        statusCode: 500
    };

    if (err instanceof mongoose.Error.ValidationError) {
        error.message = Object.values(err.errors).map(el => el.message).join(", ");
        error.statusCode = 400;
    } else if (err instanceof mongoose.Error.CastError) {
        error.message = `Invalid ${err.path}: ${err.value}`;
        error.statusCode = 400;
    } else if (err.code === 11000) {
        error.message = `Duplicate key error: ${err.keyValue}`;
        error.statusCode = 409;
    } else if (err instanceof Error || err instanceof CustomError) {
        error.name = err.name;
        error.message = err.message;
        error.statusCode = err.statusCode || 500;
    } else {
        error.message = "An unknown error occurred";
        error.statusCode = 500;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
        statusCode: error.statusCode || 500,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default errorMiddleware;
