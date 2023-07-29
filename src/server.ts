import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userRoutes, authRoutes } from "./routes";

import { protect } from "./middlewares/protect.middleware";

const app = express();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Protected routes
app.use("/api", protect, userRoutes);

// Unprotected routes
app.use("/", authRoutes);

export default app;
