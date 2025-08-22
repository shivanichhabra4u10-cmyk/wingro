"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coach_controller_1 = require("../controllers/coach.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', coach_controller_1.getAllCoaches);
router.get('/:id', coach_controller_1.getCoachById);
// Protected routes - require authentication
router.post('/', auth_1.authMiddleware.protect, coach_controller_1.createCoach);
router.put('/:id', auth_1.authMiddleware.protect, auth_1.authMiddleware.adminOnly, coach_controller_1.updateCoach);
router.delete('/:id', auth_1.authMiddleware.protect, auth_1.authMiddleware.adminOnly, coach_controller_1.deleteCoach);
router.delete('/:id/hard', auth_1.authMiddleware.protect, auth_1.authMiddleware.adminOnly, coach_controller_1.hardDeleteCoach);
exports.default = router;
