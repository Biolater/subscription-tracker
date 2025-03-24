import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

interface CustomErrorType extends Error {
    statusCode?: number;
}

export class CustomError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    let error: CustomErrorType = {
        name: "Error",
        message: "Something went wrong",
        statusCode: 500
    };

    if (err instanceof mongoose.Error.ValidationError) {
        error.message = Object.values(err.errors).map((el) => el.message).join( ", ");
        error.statusCode = 400; // Bad Request for validation errors
    } else if (err instanceof mongoose.Error.CastError) {
        error.message = `Invalid ${err.path}: ${err.value}`;
        error.statusCode = 400; // Bad Request for invalid IDs or types
    } else if ((err as any).code === 11000) {
        error.message = `Duplicate key error: ${(err as any).keyValue}`;
        error.statusCode = 409; // Conflict for duplicate values
    } else if (err instanceof Error || err instanceof CustomError) {
        error.name = err.name;
        error.message = err.message;
        error.statusCode = (err as CustomErrorType).statusCode || 500;
    } else {
        error.message = "An unknown error occurred";
        error.statusCode = 500;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
        statusCode: error.statusCode || 500,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};

export default errorMiddleware;
