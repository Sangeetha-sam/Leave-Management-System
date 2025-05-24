import express from 'express';
import { getAllTeachers } from '../controllers/userController.js';

const router = express.Router();
router.get('/teachers', getAllTeachers);
export default router;
