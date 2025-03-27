import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, getUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) => {
  res.status(200).json({ message: "CREATE user" });
});

userRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `UPDATE User ${id}` });
});

userRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `DELETE  User ${id}` });
});

export default userRouter;
