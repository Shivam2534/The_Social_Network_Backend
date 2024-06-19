import { Router } from "express";
import { CreateNewPost, SendNewPosts,CurrentUserPost,DeletePost } from "../controllers/Post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const router = Router();

router
  .route("/newpost")
  .post(verifyJWT, upload.array("media", 10), CreateNewPost);

router.route("/findnewposts").get(verifyJWT, SendNewPosts);
router.route("/CurrentUserPost").get(verifyJWT, CurrentUserPost);
router.route("/deletepost").post(verifyJWT, DeletePost);

export default router;
