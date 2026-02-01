import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tech: [String],
    link: String
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema({
  name: String,
  bio: String,

  skills: [String],

  projects: [projectSchema]
});

export const Profile = mongoose.model("Profile", profileSchema);
