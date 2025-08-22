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
exports.hardDeleteCoach = exports.deleteCoach = exports.updateCoach = exports.createCoach = exports.getCoachById = exports.getAllCoaches = void 0;
// Removed duplicate import of RequestWithUser
const Coach_1 = __importDefault(require("../models/Coach"));
const getAllCoaches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 10, page = 1, specialization, tag, sortBy = 'createdAt', sortOrder = -1 } = req.query;
        // Parse numeric parameters
        const parsedLimit = parseInt(limit) || 10;
        const parsedPage = parseInt(page) || 1;
        const skip = (parsedPage - 1) * parsedLimit;
        // Build filter based on query parameters
        const filter = { isActive: true };
        if (specialization) {
            filter.specializations = specialization;
        }
        if (tag) {
            filter.tags = tag;
        }
        // Get total count for pagination info
        const totalCount = yield Coach_1.default.countDocuments(filter);
        // Create sort object
        const sort = {};
        sort[sortBy] = sortOrder === '-1' || sortOrder === -1 ? -1 : 1;
        // Execute query with pagination
        const coaches = yield Coach_1.default.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Math.min(parsedLimit, 100)); // Maximum 100 coaches per request
        // Always include success: true in response
        res.status(200).json({
            success: true,
            count: coaches.length,
            totalCount,
            page: parsedPage,
            totalPages: Math.ceil(totalCount / parsedLimit),
            hasMore: skip + coaches.length < totalCount,
            data: coaches
        });
    }
    catch (error) {
        console.error('Error getting coaches:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});
exports.getAllCoaches = getAllCoaches;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCoachById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coach = yield Coach_1.default.findById(req.params.id);
        if (!coach || !coach.isActive) {
            res.status(404).json({
                success: false,
                error: 'Coach not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: coach
        });
    }
    catch (error) {
        console.error('Error getting coach by ID:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});
exports.getCoachById = getCoachById;
const createCoach = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ADMIN CHECK DISABLED FOR DEV
        // if (req.user?.role !== 'admin') {
        //   res.status(403).json({
        //     success: false,
        //     error: 'Unauthorized: Admin access required'
        //   });
        //   return;
        // }
        const coach = yield Coach_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: coach
        });
    }
    catch (error) {
        console.error('Error creating coach:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            res.status(400).json({
                success: false,
                error: messages
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
});
exports.createCoach = createCoach;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateCoach = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ADMIN CHECK DISABLED FOR DEV
        // console.log(req.user?.role);
        // if (req.user?.role !== 'admin') {
        //   res.status(403).json({
        //     success: false,
        //     error: 'Unauthorized: Admin access required'
        //   });
        //   return;
        // }
        const coach = yield Coach_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!coach) {
            res.status(404).json({
                success: false,
                error: 'Coach not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: coach
        });
    }
    catch (error) {
        console.error('Error updating coach:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            res.status(400).json({
                success: false,
                error: messages
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
});
exports.updateCoach = updateCoach;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteCoach = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ADMIN CHECK DISABLED FOR DEV
        // if (req.user?.role !== 'admin') {
        //   res.status(403).json({
        //     success: false,
        //     error: 'Unauthorized: Admin access required'
        //   });
        //   return;
        // }
        const coach = yield Coach_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!coach) {
            res.status(404).json({
                success: false,
                error: 'Coach not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        console.error('Error soft deleting coach:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});
exports.deleteCoach = deleteCoach;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hardDeleteCoach = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ADMIN CHECK DISABLED FOR DEV
        // if (req.user?.role !== 'admin') {
        //   res.status(403).json({
        //     success: false,
        //     error: 'Unauthorized: Admin access required'
        //   });
        //   return;
        // }
        const coach = yield Coach_1.default.findByIdAndDelete(req.params.id);
        if (!coach) {
            res.status(404).json({
                success: false,
                error: 'Coach not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        console.error('Error hard deleting coach:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});
exports.hardDeleteCoach = hardDeleteCoach;
