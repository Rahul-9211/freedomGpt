import express, { urlencoded } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { ConnectDB } from "./utils/dbconnection.js";
import userrouter from "./route/user.route.js";
import googleRouter from "./route/user.google.js";
import AIRoute from "./route/airoute.js";
import PaymentRouter from "./route/payment.route.js";
import recaptchaRoutes from "./route/recaptchaRoutes.js";
import cors from "cors";
const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: [
    "https://freedomgpt-xn47.onrender.com",
    "https://1stgpt.ai",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true, // Allow credentials (cookies) to be included
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Connect to the database
ConnectDB();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("uploads"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/", userrouter);
app.use("/", PaymentRouter);
app.use("/", googleRouter);
app.use("/", recaptchaRoutes);
app.use("/", AIRoute);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});