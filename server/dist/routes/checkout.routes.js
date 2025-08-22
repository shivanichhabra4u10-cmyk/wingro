"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkout_controller_1 = require("../controllers/checkout.controller");
const router = express_1.default.Router();
router.post('/create-checkout-session', checkout_controller_1.createCheckoutSession);
router.post('/plan-session', checkout_controller_1.createPlanCheckoutSession);
router.get('/downloads/:sessionId', checkout_controller_1.getDownloadsForSession);
exports.default = router;
