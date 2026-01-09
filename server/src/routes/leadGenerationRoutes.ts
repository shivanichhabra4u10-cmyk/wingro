import express from 'express';
import {
  submitLead,
  downloadPlaybook,
  getAllLeads,
} from '../controllers/leadGenerationController';
import { authMiddleware, RequestWithUser } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/submit', submitLead);
router.get('/download-playbook', downloadPlaybook);

// Admin only routes
router.get('/all', authMiddleware.protect, authMiddleware.adminOnly, getAllLeads);

export default router;
