import express from 'express';
import { protectRoute } from '../middleware/auth-middleware.js';
import userController from '../controllers/userController.js';
import upload from '../config/upload.js'
const router = express.Router();

router.put("/update", protectRoute, upload.single('image'), userController.updateProfile);

export default router;