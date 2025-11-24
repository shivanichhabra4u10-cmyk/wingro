// server/src/models/index.ts
import Contact from './Contact';
import { IndividualAssessment, OrganizationAssessment } from './Assessment';
import { DigitalTwinIndividual } from './DigitalTwinAssessment';
import Product from './Product';

// Export MongoDB models
export { 
  Contact,
  IndividualAssessment,
  OrganizationAssessment,
  DigitalTwinIndividual,
  Product
};