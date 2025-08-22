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
exports.getUserPlan = exports.createUserPlan = void 0;
const UserPlan_1 = __importDefault(require("../models/UserPlan"));
const createUserPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, planId, assessmentType } = req.body;
        if (!userId || !planId || !assessmentType) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        const userPlan = yield UserPlan_1.default.create({ userId, planId, assessmentType });
        res.status(201).json({ userPlan });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user plan.' });
    }
});
exports.createUserPlan = createUserPlan;
const getUserPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userPlan = yield UserPlan_1.default.findOne({ userId });
        if (!userPlan)
            return res.status(404).json({ error: 'User plan not found.' });
        res.json({ userPlan });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user plan.' });
    }
});
exports.getUserPlan = getUserPlan;
