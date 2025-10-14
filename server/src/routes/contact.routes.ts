import { Router } from 'express';
import { contactController } from '../controllers';
import { body } from 'express-validator';


const router = Router();

// POST /api/contact - Submit a contact form
router.post(
  '/',  [
    // Validation rules
    body('name').trim().not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('phoneNumber').optional().trim(),
    body('subject').trim().not().isEmpty().withMessage('Subject is required'),
    body('message').trim().not().isEmpty().withMessage('Message is required')
  ],
  contactController.submitContactForm
);

// GET /api/contact - Get all contact form submissions (public)
// NOTE: This is intentionally public. Add authMiddleware if you want to restrict.
router.get('/', contactController.getAllContactSubmissions);

export default router;
