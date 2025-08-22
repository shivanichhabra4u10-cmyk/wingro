import { Router } from 'express';
import { getCoachApplications, submitCoachApplication, approveCoachApplication } from '../controllers/coachApplication.controller';

const router = Router();

// GET /api/applications/coach
router.get('/coach', getCoachApplications);
router.post('/coach', submitCoachApplication);
// Approve coach application
router.post('/coach/:id/approve', approveCoachApplication);

export default router;
