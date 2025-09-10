import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware, RequestWithUser } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit';

const router = Router();

// Password reset routes
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// Authentication routes
router.post('/register', registerLimiter, authController.register);
// Google Sign-In
router.post('/google-login', authController.googleLogin);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', loginLimiter, authController.login);
router.get('/me', authMiddleware.protect, authController.getProfile);

// Growth Plan routes
router.get('/plans', authMiddleware.protect, authController.getGrowthPlans);
router.post('/plans', authMiddleware.protect, authController.createGrowthPlan);
router.get('/plans/:id', authMiddleware.protect, authController.getGrowthPlans);
router.put('/plans/:id', authMiddleware.protect, authController.createGrowthPlan);
router.delete('/plans/:id', authMiddleware.protect, authController.getGrowthPlans);

// Goal routes
router.get('/goals', authMiddleware.protect, authController.getGoals);
router.post('/goals', authMiddleware.protect, authController.createGoal);
router.get('/goals/:id', authMiddleware.protect, authController.getGoals);
router.put('/goals/:id', authMiddleware.protect, authController.updateGoal);
router.delete('/goals/:id', authMiddleware.protect, authController.deleteGoal);

// User management (admin only)
router.get('/users', authMiddleware.protect, adminOnly, authController.listUsers);
router.put('/users/role', authMiddleware.protect, adminOnly, authController.updateUserRole);
router.put('/users/:id', authMiddleware.protect, adminOnly, authController.updateUserDetails);

// Token verification endpoint for frontend
router.get('/verify', authMiddleware.protect, (req: RequestWithUser, res) => {
  // Return the user info from the token
  res.json(req.user);
});

export default router;
