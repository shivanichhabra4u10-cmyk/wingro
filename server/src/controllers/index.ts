// Export all controllers from one centralized file
// This makes importing controllers more convenient

// Import and export controllers
import { contactController } from './contact.controller';
import { authController } from './auth.controller';
import { assessmentController } from './assessment.controller';
import { productController } from './product.controller';

// Export all controllers
export {
  contactController,
  authController,
  assessmentController,
  productController
};

// Export default object with all controllers
export default {
    contact: contactController,
    auth: authController,
    assessment: assessmentController,
    product: productController
};