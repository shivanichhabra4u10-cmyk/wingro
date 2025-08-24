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
exports.getCoachApplications = exports.submitCoachApplication = exports.approveCoachApplication = void 0;
const Coach_1 = __importDefault(require("../models/Coach"));
// Approve coach application: update status and create Coach profile
const approveCoachApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find application
        const application = yield CoachApplication_1.default.findById(id);
        if (!application) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }
        // Update status to Approved
        application.status = 'Approved';
        yield application.save();
        // Create Coach profile
        const coachData = {
            applicationId: application.applicationId,
            certifications: application.certifications,
            yearsCoaching: application.yearsCoaching,
            preferredIndustries: application.preferredIndustries,
            languages: application.languages,
            aiToolsExperience: application.aiToolsExperience,
            referralSource: application.referralSource,
            name: application.name,
            email: application.email,
            phone: application.phone,
            title: application.specialization || 'Coach',
            rating: 5.0,
            clientCount: 0,
            specializations: [application.specialization],
            tags: [],
            pricingModel: 'hourly',
            isActive: true,
            linkedinUrl: application.linkedInUrl,
            industry: application.industry,
            growthPhilosophy: application.growthPhilosophy,
            successStory: application.successStory,
            coachingStyle: application.coachingStyle,
            targetClients: application.targetClients,
            hourlyRate: application.hourlyRate,
            availableHours: application.availableHours,
            offerPackages: application.offerPackages,
            remoteOnly: application.remoteOnly,
            resumeUrl: application.resumeUrl,
            profilePhotoUrl: application.profilePhotoUrl
        };
        // Only create if not already present
        const existingCoach = yield Coach_1.default.findOne({ name: coachData.name, specializations: coachData.specializations });
        if (!existingCoach) {
            yield Coach_1.default.create(coachData);
        }
        res.json({ success: true, message: 'Coach application approved', data: application });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});
exports.approveCoachApplication = approveCoachApplication;
const submitCoachApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, linkedInUrl, specialization, experience, currentTitle, industry, growthPhilosophy, successStory, coachingStyle, targetClients, hourlyRate, availableHours, offerPackages, remoteOnly, certifications, yearsCoaching, preferredIndustries, languages, groupCoaching, aiToolsExperience, referralSource, resumeUrl, profilePhotoUrl, status, appliedDate } = req.body;
        // Generate unique applicationId
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const applicationId = `APP${randomNum}`;
        if (!name || !email || !specialization || !experience) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const application = yield CoachApplication_1.default.create({
            applicationId,
            name,
            email,
            phone,
            linkedInUrl,
            specialization,
            experience,
            currentTitle,
            industry,
            growthPhilosophy,
            successStory,
            coachingStyle,
            targetClients,
            hourlyRate,
            availableHours,
            offerPackages,
            remoteOnly,
            certifications,
            yearsCoaching,
            preferredIndustries,
            languages,
            groupCoaching,
            aiToolsExperience,
            referralSource,
            resumeUrl,
            profilePhotoUrl,
            status: status || 'Pending',
            appliedDate: appliedDate || new Date()
        });
        res.status(201).json({ success: true, data: application });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});
exports.submitCoachApplication = submitCoachApplication;
const CoachApplication_1 = __importDefault(require("../models/CoachApplication"));
const getCoachApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield CoachApplication_1.default.find().sort({ appliedDate: -1 });
        res.json({
            success: true,
            count: applications.length,
            data: applications
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});
exports.getCoachApplications = getCoachApplications;
