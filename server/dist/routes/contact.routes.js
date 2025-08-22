"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/contact - Submit a contact form
router.post('/', [
    // Validation rules
    (0, express_validator_1.body)('name').trim().not().isEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address'),
    (0, express_validator_1.body)('phoneNumber').optional().trim(),
    (0, express_validator_1.body)('subject').trim().not().isEmpty().withMessage('Subject is required'),
    (0, express_validator_1.body)('message').trim().not().isEmpty().withMessage('Message is required')
], controllers_1.contactController.submitContactForm);
// GET /api/contact - Get all contact form submissions (admin only)
// This route is protected by authentication middleware
router.get('/', auth_1.authMiddleware.protect, controllers_1.contactController.getAllContactSubmissions);
exports.default = router;
