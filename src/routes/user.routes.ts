import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
    res.status(200).json({ message: "GET all users" });
});

userRouter.get("/:id", (req, res) => {
    const { id } = req.params
    res.status(200).json({ message: `GET User ${id} information` });
});

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