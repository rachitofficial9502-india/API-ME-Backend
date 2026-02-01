import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { router } from "./routes.js";

import bcrypt from "bcryptjs";
import { User } from "./user.js";


const app = express();

app.use(
  cors({
    origin: "*", // later: restrict to frontend domain
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());

await connectDB();

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

// OPTIONAL for now...
app.use(express.static("client"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
