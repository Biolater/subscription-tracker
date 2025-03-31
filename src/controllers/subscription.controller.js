import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import subscriptionModel from "../models/subscription.model.js";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscriptionData = req.body;
    const newSubscription = await Subscription.create({
      ...subscriptionData,
      user: req.user.userId,
    });

    await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: newSubscription._id,
      },
      headers: {
        "Content-Type": "application/json",
      },
      retries: 0,
    });
    res.status(201).json({ success: true, data: newSubscription });
  } catch (e) {
    next(e);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    if (userId !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const subscriptions = await Subscription.find({ user: userId });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await subscriptionModel.find();
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const subscription = await subscriptionModel.findById(id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    console.log(error);
    next(error);
  }
};