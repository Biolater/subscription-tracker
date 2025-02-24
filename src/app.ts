import express from "express";
import { PORT } from "./config/env.ts";

import userRouter from "./routes/user.routes.ts";
import subscriptionRouter from "./routes/subscription.routes.ts";
import authRouter from "./routes/auth.routes.ts";
import { connectDB } from "./database/mongodb.ts";

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
    res.send("HELLO")
});

app.listen(PORT, async () => {
    console.log("LISTENING")
    await connectDB();
});