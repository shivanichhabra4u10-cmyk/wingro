import { Router } from 'express';
import { 
  getAllCoaches, 
  getCoachById, 
  createCoach, 
  updateCoach, 
  deleteCoach, 
  hardDeleteCoach 
} from '../controllers/coach.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllCoaches);
router.get('/:id', getCoachById);



// Protected routes - require authentication
router.post('/', authMiddleware.protect, createCoach);
router.put('/:id', authMiddleware.protect, authMiddleware.adminOnly, updateCoach);
router.delete('/:id', authMiddleware.protect, authMiddleware.adminOnly, deleteCoach);
router.delete('/:id/hard', authMiddleware.protect, authMiddleware.adminOnly, hardDeleteCoach);

export default router;
