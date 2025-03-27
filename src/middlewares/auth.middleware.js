import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

// ...existing code removed type declarations...

export const authorize = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await User.findById(decoded.userId).select("-password -__v");
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
