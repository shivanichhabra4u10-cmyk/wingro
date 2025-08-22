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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// POST /api/diagnostic - Save diagnostic tool results
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // You can add validation and authentication here if needed
        // Accept all fields from the multi-step survey
        const diagnosticData = Object.assign({}, req.body);
        // Save to DB (replace with your DB logic)
        // Example: await Diagnostic.create(diagnosticData);
        console.log('Diagnostic submitted:', diagnosticData);
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Error saving diagnostic:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
}));
exports.default = router;
