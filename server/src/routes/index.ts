import { Router } from 'express';
import authRoutes from './auth.routes';
import contactRoutes from './contact.routes';
import assessmentRoutes from './assessment.routes';
import productRoutes from './product.routes';
import coachRoutes from './coach.routes';
import coachApplicationRoutes from './coachApplication.routes';
import diagnosticRoutes from './diagnostic.routes';
import communityRoutes from './community.routes';
import checkoutRoutes from './checkout.routes';
import cartRoutes from './cart.routes';
import bookingRoutes from './booking.routes';
import userPlanRoutes from './userPlan.routes';

const router = Router();


// Define your routes here
router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/products', productRoutes);



router.use('/coaches', coachRoutes);
router.use('/applications', coachApplicationRoutes);
router.use('/diagnostic', diagnosticRoutes);

router.use('/bookings', bookingRoutes);
router.use('/community', communityRoutes);
router.use('/cart', cartRoutes);
router.use('/', checkoutRoutes); // Stripe checkout and downloads
router.use('/user-plan', userPlanRoutes);

export default router;