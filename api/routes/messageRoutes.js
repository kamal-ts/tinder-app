import express from 'express';
import { protectRoute } from '../middleware/auth-middleware.js';
import messageController from "../controllers/messageController.js";

const router = express.Router();

router.use(protectRoute);   

router.post("/send", messageController.sendMessage);

router.get("/conversation/:userId", messageController.getConversation);

export default router;