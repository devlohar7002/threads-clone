import express from "express"
import { createPost, getPost, deletePost, getUserPosts, likeUnlikePost, replyToPost, getFeedPosts } from "../controllers/post.controller.js"
import protectRoute from "../middleware/protectRoute.middleware.js"

const router = express.Router();

router.get("/:id", getPost)
router.delete("/:id", protectRoute, deletePost)

router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost)
router.put("/like/:id", protectRoute, likeUnlikePost)
router.put("/reply", protectRoute, replyToPost)
router.get("/post/feed", protectRoute, getFeedPosts);

export default router; 