import { Router } from "express";
import {newfollower,unfollow} from "../controllers/Follower.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/newfollower").post(verifyJWT, newfollower);
router.route("/unfollow").post(verifyJWT, unfollow);

export default router;
