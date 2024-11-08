import express from 'express';
import { protectRoute } from '../middleware/auth-middleware.js';
import matchesController from "../controllers/matchesController.js";

const router = express.Router();

router.post("/swipe-right/:likedUserId", protectRoute, matchesController.swipeRight);
router.post("/swipe-left/:dislikedUserId", protectRoute, matchesController.swipeLeft);

router.get("/", protectRoute, matchesController.getMatches);
router.get("/user-profiles", protectRoute, matchesController.getUserProfiles);

export default router;