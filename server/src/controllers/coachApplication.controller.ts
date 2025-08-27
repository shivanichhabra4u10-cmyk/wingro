import Coach from '../models/Coach';
import { v4 as uuidv4 } from 'uuid';
// Approve coach application: update status and create Coach profile
export const approveCoachApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Find application
    const application = await CoachApplication.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    // Update status to Approved
    application.status = 'Approved';
    await application.save();
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
    const existingCoach = await Coach.findOne({ name: coachData.name, specializations: coachData.specializations });
    if (!existingCoach) {
      await Coach.create(coachData);
    }
    res.json({ success: true, message: 'Coach application approved', data: application });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
export const submitCoachApplication = async (req: Request, res: Response) => {
  try {
    const {
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
      status,
      appliedDate
    } = req.body;

  // Generate unique applicationId using uuid
  const applicationId = `APP-${uuidv4()}`;
    if (!name || !email || !specialization || !experience) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const application = await CoachApplication.create({
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
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
import { Request, Response } from 'express';
import CoachApplication from '../models/CoachApplication';

export const getCoachApplications = async (req: Request, res: Response) => {
  try {
    const applications = await CoachApplication.find().sort({ appliedDate: -1 });
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
