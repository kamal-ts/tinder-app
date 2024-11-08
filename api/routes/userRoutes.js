import express from 'express';
import { protectRoute } from '../middleware/auth-middleware.js';
import userController from '../controllers/userController.js'

const router = express.Router();

router.put("/update", protectRoute, userController.updateProfile);

export default router;