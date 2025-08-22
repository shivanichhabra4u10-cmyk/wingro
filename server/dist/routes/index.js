"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const assessment_routes_1 = __importDefault(require("./assessment.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const coach_routes_1 = __importDefault(require("./coach.routes"));
const coachApplication_routes_1 = __importDefault(require("./coachApplication.routes"));
const diagnostic_routes_1 = __importDefault(require("./diagnostic.routes"));
const community_routes_1 = __importDefault(require("./community.routes"));
const checkout_routes_1 = __importDefault(require("./checkout.routes"));
const cart_routes_1 = __importDefault(require("./cart.routes"));
const booking_routes_1 = __importDefault(require("./booking.routes"));
const userPlan_routes_1 = __importDefault(require("./userPlan.routes"));
const router = (0, express_1.Router)();
// Define your routes here
router.use('/auth', auth_routes_1.default);
router.use('/contact', contact_routes_1.default);
router.use('/assessment', assessment_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/coaches', coach_routes_1.default);
router.use('/applications', coachApplication_routes_1.default);
router.use('/diagnostic', diagnostic_routes_1.default);
router.use('/bookings', booking_routes_1.default);
router.use('/community', community_routes_1.default);
router.use('/cart', cart_routes_1.default);
router.use('/', checkout_routes_1.default); // Stripe checkout and downloads
router.use('/user-plan', userPlan_routes_1.default);
exports.default = router;
