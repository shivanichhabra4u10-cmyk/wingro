import { Router } from 'express';
import { assessmentController } from '../controllers';
import { body } from 'express-validator';

const router = Router();

// POST /api/assessment/individual - Submit individual assessment form
router.post(
  '/individual',
  [
    // Validation rules for individual assessment
    body('firstName').trim().not().isEmpty().withMessage('First name is required'),
    body('lastName').trim().not().isEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('jobTitle').trim().not().isEmpty().withMessage('Job title is required'),
    body('company').optional().trim(),
    body('yearsExperience').optional().trim()
  ],
  assessmentController.submitIndividualAssessment
);

// POST /api/assessment/organization - Submit organization assessment form
router.post(
  '/organization',
  [
    // Validation rules for organization assessment
    body('companyName').trim().not().isEmpty().withMessage('Company name is required'),
    body('contactName').trim().not().isEmpty().withMessage('Contact name is required'),
    body('contactEmail').isEmail().withMessage('Please enter a valid email address'),
    body('contactPhone').trim().not().isEmpty().withMessage('Phone number is required'),
    body('companySize').not().isEmpty().withMessage('Company size is required'),
    body('industry').not().isEmpty().withMessage('Industry is required'),
    body('challengeArea').optional().trim(),
    body('message').optional().trim()
  ],
  assessmentController.submitOrganizationAssessment
);

// PUT /api/assessment/individual/:id - Update individual assessment with responses
router.put(
  '/individual/:id',
  [
    body('responseData').not().isEmpty().withMessage('Response data is required')
  ],
  assessmentController.updateIndividualAssessment
);

// PUT /api/assessment/organization/:id - Update organization assessment with responses
router.put(
  '/organization/:id',
  [
    body('responseData').not().isEmpty().withMessage('Response data is required')
  ],
  assessmentController.updateOrganizationAssessment
);

export default router;
