import { Router } from "express";
import { createlike } from "../controllers/Like.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/createlike").post(verifyJWT, createlike);
// router.route("/destroylike").post(verifyJWT, destroylike);

export default router;
