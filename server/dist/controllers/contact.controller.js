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
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = void 0;
const models_1 = require("../models");
const express_validator_1 = require("express-validator");
exports.contactController = {
    /**
     * Submit contact form
     * @route POST /api/contact
     */
    submitContactForm: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try { // Check for validation errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Extract form data from request body
            const { name, email, phoneNumber, subject, message } = req.body;
            // Create new contact entry in MongoDB
            const contactEntry = yield models_1.Contact.create({
                name,
                email,
                phoneNumber,
                subject,
                message
            });
            // Return success response
            res.status(201).json({
                success: true,
                message: 'Contact Shivani form submitted successfully',
                data: contactEntry
            });
        }
        catch (error) {
            console.error('Error in contact form submission:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while processing your request'
            });
        }
    }),
    /**
     * Get all contact form submissions (admin only)
     * @route GET /api/contact
     */
    getAllContactSubmissions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const contactSubmissions = yield models_1.Contact.find().sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                count: contactSubmissions.length,
                data: contactSubmissions
            });
        }
        catch (error) {
            console.error('Error fetching contact submissions:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching contact submissions'
            });
        }
    })
};
