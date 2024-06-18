import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user_created_post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    maxlength: 500, // Limit the text length to 500 characters
  },
  media: [
    {
      url: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  location: {
    type: String,
  },
  shares: {
    type: Number,
    default: 0,
  },
  toggleShare: {
    type: Boolean,
    default: true,
  },
  toggleComments: {
    type: Boolean,
    default: true,
  },
});

export const Post = mongoose.model("Post", PostSchema);
