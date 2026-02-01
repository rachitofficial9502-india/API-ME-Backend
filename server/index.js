import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { router } from "./routes.js";

import bcrypt from "bcryptjs";
import { User } from "./user.js";


const app = express();

app.use(express.json());

const existingUser = await User.findOne({ email: process.env.ADMIN_EMAIL });

if (!existingUser) {
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    email: process.env.ADMIN_EMAIL,
    passwordHash: hash
  });

  console.log("Admin user created");
}

app.use("/api", router);

export default app;

