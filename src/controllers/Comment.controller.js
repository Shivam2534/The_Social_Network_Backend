import { Comment } from "../models/Comment.model.js";
import { Post } from "../models/Post.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
  const { comment, comment_to_post } = req.body;
  console.log(comment, comment_to_post);

  if (!comment || !comment_to_post) {
    throw new ApiError(
      400,
      "Comment as a text is a required field,also post id"
    );
  }

  const post = await Post.findById(comment_to_post);
  if (!post) {
    throw new ApiError(400, "No post exist with this post id");
  }

  const Newcomment = await Comment.create({
    comment_to_post: post._id,
    comment_by: req.user?._id,
    comment,
  });

  post.comments.push(Newcomment);
  await post.save();
  // console.log("That post-", post);



  if (!Newcomment) {
    throw new ApiError(500, "Something went wrong while creating new comment");
  }

  // console.log(Newcomment);

  return res
    .status(200)
    .json(new apiResponse(200, Newcomment, "Comment created successfully"));
});

export { createComment };
