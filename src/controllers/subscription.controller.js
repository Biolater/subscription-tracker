import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscriptionData = req.body;
    const newSubscription = await Subscription.create({
      ...subscriptionData,
      user: req.user.userId,
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
