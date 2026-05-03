import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// This functionality has been moved to the frontend for security and performance
router.post('/resume-critique', async (req: AuthRequest, res) => {
  res.status(410).json({ error: 'This endpoint is deprecated. Please use the frontend AI integration.' });
});

export default router;
