import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register); // Can restrict in frontend to HOD/admin only
router.post('/login', login);
router.get('/profile', protect, getProfile);

export default router;
