import { NextFunction, Request, Response } from "express";
import User from "../models/user.model.ts";
import { CustomError } from "../middlewares/error.middleware.ts";

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            data: users,
        })
    } catch (error) {
        next(error)
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const user = await User.findById(req.params.id).select("-password -__v");
        if (!user) {
            throw new CustomError("User not found", 404)
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error)
    }
}