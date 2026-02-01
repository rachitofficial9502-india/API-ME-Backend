import express from "express";
import { Profile } from "./profile.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.js";
import { authRequired } from "./auth.js";

import { connectDB } from "./db.js";

export const router = express.Router();

async function withDB(req, res, next) {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ error: "Database unavailable" });
  }
}

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.post("/auth/login", withDB, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});


/* Get full profile */
router.get("/profile", withDB, async (req, res) => {
  res.set("Cache-Control", "no-store");
  const profile = await Profile.findOne();
  res.json(profile);
});

/* Update profile (single-user upsert) */
router.put("/profile", authRequired, withDB, async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    {},
    req.body,
    { new: true, upsert: true }
  );
  res.json(profile);
});

/* ---------------- QUERY ENDPOINTS ---------------- */

/* Search by skill */
router.get("/search/skills", withDB, async (req, res) => {
  const { skill } = req.query;

  if (!skill) {
    return res.status(400).json({ error: "skill query is required" });
  }

  const profile = await Profile.findOne({
    skills: { $regex: skill, $options: "i" }
  });

  res.json(profile ? profile.skills : []);
});

/* List all projects */
router.get("/projects", withDB, async (req, res) => {
  const profile = await Profile.findOne();
  res.json(profile?.projects || []);
});

/* Search projects by tech */
router.get("/search/projects", withDB, async (req, res) => {
  const { tech } = req.query;

  if (!tech) {
    return res.status(400).json({ error: "tech query is required" });
  }

  const profile = await Profile.findOne({
    "projects.tech": { $regex: tech, $options: "i" }
  });

  if (!profile) return res.json([]);

  const results = profile.projects.filter(project =>
    project.tech.some(t =>
      t.toLowerCase().includes(tech.toLowerCase())
    )
  );

  res.json(results);
});

/* Generic search */
router.get("/search", withDB, async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "q query is required" });
  }

  const profile = await Profile.findOne();
  if (!profile) return res.json({});

  const skills = profile.skills.filter(s =>
    s.toLowerCase().includes(q.toLowerCase())
  );

  const projects = profile.projects.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase()) ||
    p.tech.some(t => t.toLowerCase().includes(q.toLowerCase()))
  );

  res.json({ skills, projects });
});
