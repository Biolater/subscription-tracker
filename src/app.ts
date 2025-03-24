import express from "express";
import { PORT } from "./config/env.ts";
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.ts";
import subscriptionRouter from "./routes/subscription.routes.ts";
import authRouter from "./routes/auth.routes.ts";
import { connectDB } from "./database/mongodb.ts";
import errorMiddleware from "./middlewares/error.middleware.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware)

app.get("/", (req, res) => {
    res.send("HELLO")
});

app.listen(PORT, async () => {
    console.log("LISTENING at PORT", PORT);
    await connectDB();
});