// Seed script for GrowthPlan collection
import * as mongoose from 'mongoose';
import GrowthPlan from '../models/GrowthPlan';

const plans = [
  {
    name: 'Silver',
    description: 'Foundation Building',
    features: [
      'AI-guided self-assessment',
      'Basic skill roadmap',
      'Community access',
      'Email support',
      'Digital resource library',
    ],
    price: 4900,
    stripeProductId: 'prod_silver_001',
  },
  {
    name: 'Gold',
    description: 'Accelerated Growth',
    features: [
      'Everything in Silver Plan',
      '1:1 AI coaching sessions',
      'Personalized learning path',
      'Priority support',
      'Monthly progress tracking',
    ],
    price: 9900,
    stripeProductId: 'prod_gold_001',
  },
  {
    name: 'Diamond',
    description: 'Elite Transformation',
    features: [
      'Everything in Gold Plan',
      'Executive AI mentorship',
      'Custom growth strategy',
      'VIP network access',
      'Quarterly career roadmapping',
    ],
    price: 19900,
    stripeProductId: 'prod_diamond_001',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || '', {});
  await GrowthPlan.deleteMany({});
  await GrowthPlan.insertMany(plans);
  console.log('Growth plans seeded');
  await mongoose.disconnect();
}

seed();
