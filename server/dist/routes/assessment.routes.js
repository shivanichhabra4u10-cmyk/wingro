"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// POST /api/assessment/individual - Submit individual assessment form
router.post('/individual', [
    // Validation rules for individual assessment
    (0, express_validator_1.body)('firstName').trim().not().isEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().not().isEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address'),
    (0, express_validator_1.body)('jobTitle').trim().not().isEmpty().withMessage('Job title is required'),
    (0, express_validator_1.body)('company').optional().trim(),
    (0, express_validator_1.body)('yearsExperience').optional().trim()
], controllers_1.assessmentController.submitIndividualAssessment);
// POST /api/assessment/organization - Submit organization assessment form
router.post('/organization', [
    // Validation rules for organization assessment
    (0, express_validator_1.body)('companyName').trim().not().isEmpty().withMessage('Company name is required'),
    (0, express_validator_1.body)('contactName').trim().not().isEmpty().withMessage('Contact name is required'),
    (0, express_validator_1.body)('contactEmail').isEmail().withMessage('Please enter a valid email address'),
    (0, express_validator_1.body)('contactPhone').trim().not().isEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('companySize').not().isEmpty().withMessage('Company size is required'),
    (0, express_validator_1.body)('industry').not().isEmpty().withMessage('Industry is required'),
    (0, express_validator_1.body)('challengeArea').optional().trim(),
    (0, express_validator_1.body)('message').optional().trim()
], controllers_1.assessmentController.submitOrganizationAssessment);
// PUT /api/assessment/individual/:id - Update individual assessment with responses
router.put('/individual/:id', [
    (0, express_validator_1.body)('responseData').not().isEmpty().withMessage('Response data is required')
], controllers_1.assessmentController.updateIndividualAssessment);
// PUT /api/assessment/organization/:id - Update organization assessment with responses
router.put('/organization/:id', [
    (0, express_validator_1.body)('responseData').not().isEmpty().withMessage('Response data is required')
], controllers_1.assessmentController.updateOrganizationAssessment);
exports.default = router;
