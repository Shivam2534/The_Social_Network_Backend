import { Router } from "express";
import {
  SignUpNewUser,
  loginUser,
  searchbar,
  getUserById,
  updateCurrentUserDetails,
  latestDataOfCurrentUser,
} from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/signupnewuser").post(upload.single("avatar"), SignUpNewUser);
router.route("/loginuser").post(loginUser);
router.route("/searchbar").post(verifyJWT, searchbar);
router.route("/:userId").get(verifyJWT, getUserById);
router.route("/edit").post(verifyJWT, updateCurrentUserDetails);
router.route("/currentdata").post(verifyJWT, updateCurrentUserDetails);

export default router;
