import { Router } from "express";
import { createComment } from "../controllers/Comment.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/createcomment").post(verifyJWT, createComment);

export default router;
