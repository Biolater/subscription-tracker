import { Router } from "express";

const authRouter = Router();

authRouter.get("/sign-in", (req, res) => {
    res.status(200).json({ message: "Sign in" });
});

authRouter.get("/sign-up", (req, res) => {
    res.status(200).json({ message: "Sign up" })
});

authRouter.get("/sign-out", (req, res) => {
    res.status(200).json({ message: "Sign out" })
});

export default authRouter