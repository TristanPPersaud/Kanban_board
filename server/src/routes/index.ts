import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public route for authentication (no authentication required)
router.use('/auth', authRoutes);

// Apply the authenticateToken middleware to all routes under '/api' to secure them
router.use('/api', authenticateToken, apiRoutes);

export default router;
