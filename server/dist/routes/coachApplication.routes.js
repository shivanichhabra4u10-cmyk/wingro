"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coachApplication_controller_1 = require("../controllers/coachApplication.controller");
const router = (0, express_1.Router)();
// GET /api/applications/coach
router.get('/coach', coachApplication_controller_1.getCoachApplications);
router.post('/coach', coachApplication_controller_1.submitCoachApplication);
// Approve coach application
router.post('/coach/:id/approve', coachApplication_controller_1.approveCoachApplication);
exports.default = router;
