import mongoose from "mongoose";

const followerSchema = new mongoose.Schema(
  {
    user_follow_to: {
      // jis new user ko follow kiya hai
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Follower = mongoose.model("Follower", followerSchema);
