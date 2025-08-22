"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userPlan_controller_1 = require("../controllers/userPlan.controller");
const router = express_1.default.Router();
router.post('/', userPlan_controller_1.createUserPlan);
router.get('/:userId', userPlan_controller_1.getUserPlan);
exports.default = router;
