import { Like } from "../models/Like.model.js";
import { Post } from "../models/Post.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createlike = asyncHandler(async (req, res) => {
  const { post_liked_to } = req.body;

  if (!post_liked_to) {
    throw new ApiError(400, "Post ID not found");
  }

  const post = await Post.findById(post_liked_to);
  if (!post) {
    throw new ApiError(400, "No post exists with this post ID");
  }

  const likedby = req.user?._id;

  const existingLike = await Like.findOne({ post_liked_to: post._id, likedby });

  if (!existingLike) {
    const like = await Like.create({
      post_liked_to: post._id,
      likedby,
    });

    if (!like) {
      throw new ApiError(500, "Unable to like the post");
    }

    post.likes.push(likedby);
    await post.save();

    return res
      .status(200)
      .json(new apiResponse(200, like, "Liked post successfully"));
  } else {
    const deletedlike = await Like.findOneAndDelete({
      post_liked_to: post._id,
      likedby,
    });

    if (!deletedlike) {
      throw new ApiError(500, "Failed to delete like");
    }

    console.log("Deleted like-", deletedlike);
    post.likes = post.likes.filter(
      (likeId) => likeId.toString() !== likedby.toString()
    );
    await post.save();

    return res
      .status(200)
      .json(new apiResponse(200, deletedlike, "Like deleted successfully"));
  }
});

// const destroylike = asyncHandler(async (req, res) => {
//   const { post_liked_to } = req.body;

//   if (!post_liked_to) {
//     throw new ApiError(400, "Post ID not provided");
//   }

//   const post = await Post.findById(post_liked_to);
//   if (!post) {
//     throw new ApiError(400, "Post not found");
//   }

//   const likedby = req.user?._id;
//   if (!likedby) {
//     throw new ApiError(401, "User not authenticated");
//   }

//   const deletedlike = await Like.findOneAndDelete({
//     post_liked_to: post._id,
//     likedby,
//   });

//   if (!deletedlike) {
//     throw new ApiError(500, "Failed to delete like");
//   }

//   console.log("Deleted like-", deletedlike);
//   post.likes = post.likes.filter(
//     (likeId) => likeId.toString() !== deletedlike._id.toString()
//   );
//   await post.save();

//   return res
//     .status(200)
//     .json(new apiResponse(200, deletedlike, "Like deleted successfully"));
// });

export { createlike };
