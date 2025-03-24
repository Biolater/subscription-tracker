import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.ts";
import User from "../models/user.model.ts";

interface CustomJwtPayload extends JwtPayload {
    userId: string;
}

export const authorize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
        
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as CustomJwtPayload;
        const user = await User.findById(decoded.userId).select('-password -__v');

        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};