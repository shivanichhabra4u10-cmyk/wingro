import express from 'express';
import { createUserPlan, getUserPlan } from '../controllers/userPlan.controller';

const router = express.Router();

router.post('/', createUserPlan);
router.get('/:userId', getUserPlan);

export default router;
