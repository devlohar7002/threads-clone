import express from "express"
import { repostPost, getUserReposts, removeRepost } from "../controllers/repost.controller.js"
import protectRoute from "../middleware/protectRoute.middleware.js"

const router = express.Router();

router.get("/repost/feed/:username", protectRoute, getUserReposts);
router.post("/repost/:id", protectRoute, repostPost);
router.delete("/delete/:id", protectRoute, removeRepost);

export default router; 