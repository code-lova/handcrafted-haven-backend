import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // prevent password from being returned in queries by default
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite issue in dev with hot reloading
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
