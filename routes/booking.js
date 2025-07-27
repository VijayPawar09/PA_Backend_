import express from 'express';
import { bookService } from '../controllers/bookingController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/book', auth, bookService);

export default router;
