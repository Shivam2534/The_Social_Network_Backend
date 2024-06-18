import { ApiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Follower } from "../models/Followers.js";
import { User } from "../models/User.model.js";

const newfollower = asyncHandler(async (req, res) => {
  const { user_follow_to } = req.body;
  //   console.log(user_follow_to);

  if (!user_follow_to) {
    throw new ApiError(400, "user id not found");
  }

  const CurrentUser = await User.findById(req.user?._id);
  const UserToWhichWeFollow = await User.findById(user_follow_to);

  const newFollower = await Follower.create({
    user_follow_to: UserToWhichWeFollow._id,
    followedby: CurrentUser._id,
  });

  if (!newFollower) {
    throw new ApiError(500, "New Follower document not created");
  }

  CurrentUser.follow.push(UserToWhichWeFollow._id);
  await CurrentUser.save();
  UserToWhichWeFollow.followers.push(CurrentUser._id);
  await UserToWhichWeFollow.save();

  return res
    .status(200)
    .json(new apiResponse(200, newFollower, "Followed successfully"));
});

const unfollow = asyncHandler(async (req, res) => {
  const { user_unfollow_to } = req.body;
  //   console.log(user_follow_to);

  if (!user_unfollow_to) {
    throw new ApiError(400, "user id not found");
  }

  const CurrentUser = await User.findById(req.user?._id);
  const UserToWhichWeunFollow = await User.findById(user_unfollow_to);

  const unfollowed = await Follower.findOneAndDelete({
    user_follow_to: UserToWhichWeunFollow._id,
    followedby: CurrentUser._id,
  });

  if (!unfollowed) {
    throw new ApiError(500, "Document not deleted");
  }

  console.log(unfollowed);
  CurrentUser.follow = CurrentUser.follow.filter(
    (following) => following.toString() !== UserToWhichWeunFollow._id.toString()
  );
  await CurrentUser.save();

  UserToWhichWeunFollow.followers = UserToWhichWeunFollow.followers.filter(
    (follower) => follower.toString() !== CurrentUser._id.toString()
  );
  await UserToWhichWeunFollow.save();

  return res
    .status(200)
    .json(new apiResponse(200, {}, "unFollow successfully"));
});

export { newfollower, unfollow };
