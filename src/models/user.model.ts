import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // ensures no duplicate emails
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // teacher requirement
      default: "user",
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export const UserModel = mongoose.model("User", userSchema);
