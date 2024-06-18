import { Post } from "../models/Post.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";

const CreateNewPost = asyncHandler(async (req, res) => {
  try {
    const { text, location } = req.body;
    console.log(text, location);

    const mediaFiles = req.files; // Get the array of media files
    console.log("mediafiles-", mediaFiles);

    // Upload media files to Cloudinary and get their URLs
    const mediapost = await Promise.all(
      mediaFiles.map(async (file) => {
        const result = await UploadOnCloudinary(file.path);
        return {
          url: result.url,
          type: file.mimetype.startsWith("image") ? "image" : "video",
        };
      })
    );

    console.log("media-", mediapost);

    const NewPost = await Post.create({
      user_created_post: req.user?._id,
      media: mediapost,
      text,
      location,
    });

    if (!NewPost) {
      throw new ApiError(500, "Unable to create new post");
    }

    // Update the user's posts array
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { $push: { posts: NewPost } },
      { new: true } // Ensure we get the updated document back
    );

    if (!updatedUser) {
      throw new ApiError(500, "Failed to update user's posts");
    }

    return res
      .status(200)
      .json(new apiResponse(200, NewPost, "New post created Successfully"));
  } catch (error) {
    console.log("Something went wrong while posting a new post");
    console.log(error);
    throw new ApiError(500, "Post uploadation is failed");
  }
});

const SendNewPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate({ path: "user_created_post", select: "username avatar" })
    .populate({
      path: "comments",
      populate: {
        path: "comment_by",
        select: "username avatar",
      },
    });

  res
    .status(200)
    .json(new apiResponse(200, posts, "New post fetched successfully"));
});

const CurrentUserPost = asyncHandler(async (req, res) => {
  const CurrUserPosts = await Post.find({ user_created_post: req.user?._id });
  if (!CurrUserPosts) {
    res.status(404).json(new apiResponse(404, {}, "Not posted yet"));
  }

  res
    .status(200)
    .json(new apiResponse(200, CurrUserPosts, "Post of current user"));
});

export { CreateNewPost, SendNewPosts, CurrentUserPost };
