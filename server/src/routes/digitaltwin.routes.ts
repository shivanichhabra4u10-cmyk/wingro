import { Router } from 'express';
import { assessmentController } from '../controllers';
import { body, validationResult } from 'express-validator';

const router = Router();

// POST /api/digitaltwin/individual - Start Digital Twin individual assessment
router.post(
  '/individual',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('jobTitle').optional().trim(),
    body('company').optional().trim(),
    body('yearsExperience').optional().trim(),
    body('linkedinUrl').optional().trim(),
    body('aspiration').optional().trim(),
    body('passion').optional().trim(),
    body('purpose').optional().trim(),
    body('individualType').optional().trim(),
    body('category').optional().trim(),
    body('assessmentType').optional().trim(),
    body('userId').optional().trim()
  ],
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  assessmentController.submitDigitalTwinIndividual
);

// PUT /api/digitaltwin/individual/:id - Update Digital Twin assessment with responses
router.put(
  '/individual/:id',
  [
    body('responseData').not().isEmpty().withMessage('Response data is required')
  ],
  assessmentController.updateDigitalTwinIndividual
);

// GET /api/digitaltwin/individual/:id - Get Digital Twin assessment by ID
router.get(
  '/individual/:id',
  assessmentController.getDigitalTwinIndividual
);

// GET /api/digitaltwin/individual/:id/scores - Generate Digital Twin assessment scores
router.get(
  '/individual/:id/scores',
  assessmentController.generateDigitalTwinScores
);

export default router;
