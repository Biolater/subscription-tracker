import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.status(200).json({ message: "GET all subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
  res.status(200).json({ message: "GET subscription details" });
});

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req, res) => {
  res.status(200).json({ message: "UPDATE subscription" });
});

subscriptionRouter.delete("/:id", (req, res) => {
  res.status(200).json({ message: "DELETE subscription" });
});

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.put("/:id/cancel", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: "CANCEL subscription" });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.status(200).json({ message: "GET upcoming renewals" });
});

export default subscriptionRouter;
