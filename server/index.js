import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { router } from "./routes.js";

import bcrypt from "bcryptjs";
import { User } from "./user.js";


const app = express();

app.use(express.json());

app.use("/api", router);

export default app;

