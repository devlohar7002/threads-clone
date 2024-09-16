import express from "express"
import { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile, randomUser } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.middleware.js"

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id', protectRoute, followUnfollowUser)
router.put('/update/:id', protectRoute, updateUser)
router.get('/randomUsers', protectRoute, randomUser)

export default router