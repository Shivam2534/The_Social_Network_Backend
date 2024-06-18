import { Router } from "express";
import {
  SignUpNewUser,
  loginUser,
  searchbar,
  getUserById,
} from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/signupnewuser").post(upload.single("avatar"), SignUpNewUser);
router.route("/loginuser").post(loginUser);
router.route("/searchbar").post(verifyJWT, searchbar);
router.route("/:userId").get(verifyJWT, getUserById);

export default router;
