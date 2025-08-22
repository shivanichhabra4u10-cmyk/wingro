"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Seed script for GrowthPlan collection
const mongoose_1 = __importDefault(require("mongoose"));
const GrowthPlan_1 = __importDefault(require("../models/GrowthPlan"));
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
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGO_URI || '', {});
        yield GrowthPlan_1.default.deleteMany({});
        yield GrowthPlan_1.default.insertMany(plans);
        console.log('Growth plans seeded');
        yield mongoose_1.default.disconnect();
    });
}
seed();
