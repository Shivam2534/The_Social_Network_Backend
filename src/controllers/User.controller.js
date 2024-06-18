import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";
import { Post } from "../models/Post.model.js";

const SignUpNewUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;
  console.log(username, email, password, fullname);

  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(401, "All fields are rquired");
  }

  const userexisted = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (userexisted) {
    throw new ApiError(409, "User with email|username is already existed");
  }
  console.log(req.file);
  const avtarLoacalPath = req.file?.path;
  if (!avtarLoacalPath) {
    throw new ApiError(400, "Avatar is required field");
  }
  const avatar = await UploadOnCloudinary(avtarLoacalPath); // we get object
  if (!avatar) {
    throw new ApiError(400, "Avatar is required field");
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createduser) {
    throw new ApiError(500, "Something went wrong while Registering a user");
  }
  return res
    .status(200)
    .json(new apiResponse(200, createduser, "User Created Successfully"));
});

const GenerateAccessAndRefreshTokens = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();

    user.refreshToken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (error) {
    console.log("Error is:", error);
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh tokne "
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(401, "Fields can not be empty");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new apiResponse(400, "Account not found , please register first");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(402, "Wrong credentialds");
  }

  const { accesstoken, refreshtoken } = await GenerateAccessAndRefreshTokens(
    user._id
  );

  // we are again fetching data of user becouse previous data does not have refresh token , thats why we need updated user
  const loggedinuser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // whenever we send cookies we always design some option like this , so that no one can modified our cookies except on server
  const options = {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedinuser,
          accesstoken,
          refreshtoken,
        },
        "User Logged In  Successfully"
      )
    );
});

const searchbar = asyncHandler(async (req, res) => {
  const { searchitem } = req.body;
  console.log(searchitem);

  const users = await User.aggregate([
    {
      $match: {
        $or: [
          { fullname: { $regex: searchitem, $options: "i" } }, // Case-insensitive search
          { username: { $regex: searchitem, $options: "i" } },
        ],
      },
    },
  ]);

  // console.log("users data-", users);
  if (users) {
    res.status(200).json(new apiResponse(200, users, "All account fetched"));
  } else {
    res
      .status(404)
      .json(new apiResponse(404, {}, "No Account with this username/fullname"));
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId)
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(new apiResponse(404, {}, "User Not Found"));
    }

    const CurrUserPosts = await Post.find({ user_created_post: user._id });
    if (!CurrUserPosts) {
      res.status(404).json(new apiResponse(404, {}, "Not posted yet"));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          { user, posts: CurrUserPosts },
          "User profile fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export { SignUpNewUser, loginUser, searchbar, getUserById };
