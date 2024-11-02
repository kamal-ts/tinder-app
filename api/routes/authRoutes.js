import express from 'express';
import authController from '../controllers/authController.js';
import { user } from '../middleware/validation/userValidation.js'
import { protectRoute } from '../middleware/auth-middleware.js';

const router = express.Router();

router.post("/signup", user, authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/me", protectRoute, authController.me);

export default router;