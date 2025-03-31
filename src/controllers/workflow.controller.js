import { createRequire } from "module";
import subscriptionModel from "../models/subscription.model.js";
import dayjs from "dayjs";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") {
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);
  const today = dayjs();

  if (renewalDate.isBefore(today)) {
    console.log("Subscription is already renewed");
    return;
  }

  for (const dayBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(dayBefore, "day");

    if (reminderDate.isBefore(today)) {
      continue;
    }

    await sleepUntilReminder(context, `reminder-${dayBefore}`, reminderDate);
    await sendReminder(context, subscription, reminderDate);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  // Fetch subscription outside of context.run to avoid capturing MongoDB connections
  let subscription;
  try {
    // Get the subscription data
    const result = await subscriptionModel.findById(subscriptionId)
      .populate("user", "name email")
      .lean();
    
    // If no result, return null
    if (!result) return null;
    
    // Create a serializable clean object with only the data we need
    subscription = {
      _id: result._id.toString(),
      name: result.name,
      status: result.status,
      renewalDate: result.renewalDate,
      user: {
        _id: result.user._id.toString(),
        name: result.user.name,
        email: result.user.email
      }
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
  
  // Now use context.run with the clean serializable object
  return await context.run("fetch-subscription", () => subscription);
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Waiting until ${label} at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const sendReminder = async (context, subscription, reminderDate) => {
  console.log(
    `Sending reminder for ${subscription.user.name} at ${reminderDate}`
  );
};
