import express from 'express';
import { createCheckoutSession, getDownloadsForSession, createPlanCheckoutSession } from '../controllers/checkout.controller';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/plan-session', createPlanCheckoutSession);
router.get('/downloads/:sessionId', getDownloadsForSession);

export default router;
