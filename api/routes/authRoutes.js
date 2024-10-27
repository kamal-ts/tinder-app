import express from 'express';
import authController from '../controllers/authController.js';
import { user } from '../middleware/validation/userValidation.js'

const router = express.Router();

router.post("/signup", user, authController.signup);
router.get("/login", authController.login);
// router.post("/logout", logout);

export default router;