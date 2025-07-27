import express from 'express';
import { getUserNotifications } from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getUserNotifications);

export default router;
