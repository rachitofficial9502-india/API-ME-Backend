import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { router } from "./routes.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://api-me-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use("/api", router);

export default app;

