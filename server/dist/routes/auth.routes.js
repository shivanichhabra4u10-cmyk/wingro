"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const adminOnly_1 = require("../middleware/adminOnly");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// Password reset routes
router.post('/request-password-reset', auth_controller_1.authController.requestPasswordReset);
router.post('/reset-password', auth_controller_1.authController.resetPassword);
// Authentication routes
router.post('/register', rateLimit_1.registerLimiter, auth_controller_1.authController.register);
router.post('/send-otp', auth_controller_1.authController.sendOtp);
router.post('/verify-otp', auth_controller_1.authController.verifyOtp);
router.get('/verify-email', auth_controller_1.authController.verifyEmail);
router.post('/login', rateLimit_1.loginLimiter, auth_controller_1.authController.login);
router.get('/me', auth_1.authMiddleware.protect, auth_controller_1.authController.getProfile);
// Growth Plan routes
router.get('/plans', auth_1.authMiddleware.protect, auth_controller_1.authController.getGrowthPlans);
router.post('/plans', auth_1.authMiddleware.protect, auth_controller_1.authController.createGrowthPlan);
router.get('/plans/:id', auth_1.authMiddleware.protect, auth_controller_1.authController.getGrowthPlans);
router.put('/plans/:id', auth_1.authMiddleware.protect, auth_controller_1.authController.createGrowthPlan);
router.delete('/plans/:id', auth_1.authMiddleware.protect, auth_controller_1.authController.getGrowthPlans);
// Goal routes
router.get('/goals', auth_1.authMiddleware.protect, auth_controller_1.authController.getGoals);
router.post('/goals', auth_1.authMiddleware.protect, auth_controller_1.authController.createGoal);
router.get('/goals/:id', auth_1.authMiddleware.protect, auth_controller_1.authController.getGoals);
router.put('/goals/:id', auth_1.authMiddleware.protect, auth_controller_1.authController.updateGoal);
router.delete('/goals/:id', auth_1.authMiddleware.protect, auth_controller_1.authController.deleteGoal);
// User management (admin only)
router.get('/users', auth_1.authMiddleware.protect, adminOnly_1.adminOnly, auth_controller_1.authController.listUsers);
router.put('/users/role', auth_1.authMiddleware.protect, adminOnly_1.adminOnly, auth_controller_1.authController.updateUserRole);
router.put('/users/:id', auth_1.authMiddleware.protect, adminOnly_1.adminOnly, auth_controller_1.authController.updateUserDetails);
// Token verification endpoint for frontend
router.get('/verify', auth_1.authMiddleware.protect, (req, res) => {
    // Return the user info from the token
    res.json(req.user);
});
exports.default = router;
