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

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(today)) {
      await sleepUntilReminder(context, `reminder-${daysBefore}`, reminderDate);
    }
    await triggerReminder(context, `reminder-${daysBefore}`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get-subscription", async () => {
    return subscriptionModel.findById(subscriptionId).populate("user");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Waiting until ${label} at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return await context.run(`Trigger reminder ${label}`, async () => {
    console.log(`Triggering reminder ${label}`);
  });
};
