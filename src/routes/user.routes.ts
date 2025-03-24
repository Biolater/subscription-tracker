import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.ts";
import { authorize } from "../middlewares/auth.middleware.ts";

const userRouter = Router();

userRouter.get("/", getUsers)

userRouter.get("/:id", authorize, getUser)
userRouter.post("/", (req, res) => {
    res.status(200).json({ message: "CREATE user" });
});

userRouter.put("/:id", (req, res) => {
    const { id } = req.params
    res.status(200).json({ message: `UPDATE User ${id}` });
});

userRouter.delete("/:id", (req, res) => {
    const { id } = req.params
    res.status(200).json({ message: `DELETE  User ${id}` });
})

export default userRouter