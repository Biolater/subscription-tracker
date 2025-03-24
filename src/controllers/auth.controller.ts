import { NextFunction, Request, Response } from "express";
import mongoose, { mongo } from "mongoose";
import User from "../models/user.model.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.ts";

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            throw new Error("Please provide all fields");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        // hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create new user
        const user = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = await User.create([user], { session });

        // Create new token
        const token = jwt.sign({
            userId: newUser[0]._id,
            email: newUser[0].email,

        }, JWT_SECRET!, { expiresIn: "1d" })

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            token,
            user: {
                name: newUser[0].name,
                email: newUser[0].email,
                id: newUser[0]._id,
                createdAt: newUser[0].createdAt,
                updatedAt: newUser[0].updatedAt,
            },
            message: "User created successfully",
        });


    } catch (error) {
        session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if all fields are provided
        if (!email || !password) {
            throw new Error("Please provide all fields");
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new Error("User does not exist");
        }

        // Check if password is correct
        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
        }

        // Create new token
        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
        }, JWT_SECRET!, { expiresIn: "1d" })

        res.status(200).json({
            success: true,
            token,
            user: {
                name: existingUser.name,
                email: existingUser.email,
                id: existingUser._id,
                createdAt: existingUser.createdAt,
                updatedAt: existingUser.updatedAt,
            },
            message: "User logged in successfully",
        });

    } catch (error) {
        next(error)
    }
};

export const signOut = async (req: Request, res: Response): Promise<void> => {
    try {
        // Your sign-up logic here
        res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};