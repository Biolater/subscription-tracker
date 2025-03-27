import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN } = process.env;
export { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN };
