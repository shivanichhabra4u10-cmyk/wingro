import { Request, Response } from 'express';
import { IndividualAssessment, OrganizationAssessment } from '../models';
import { validationResult } from 'express-validator';

export const assessmentController = {
  /**
   * Submit individual assessment data
   * @route POST /api/assessment/individual
   */
  submitIndividualAssessment: async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extract form data from request body
      const { 
        firstName, 
        lastName, 
        email, 
        jobTitle, 
        company, 
        yearsExperience,
        individualType,
        educationLevel,
        linkedinUrl,
        category,
        assessmentType
      } = req.body;

      console.log('Received individual assessment:', { 
        firstName, 
        lastName, 
        email, 
        jobTitle,
        individualType,
        category 
      });
      
      // Create new assessment entry in MongoDB
      const assessment = await IndividualAssessment.create({
        firstName,
        lastName,
        email,
        jobTitle,
        company,
        yearsExperience,
        individualType,
        educationLevel,
        linkedinUrl,
        category,
        assessmentType: assessmentType || 'individual',
        responseData: {} // Initialize responseData as an empty object
      });

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Individual assessment information submitted successfully',
        data: assessment
      });
    } catch (error) {
      console.error('Error in individual assessment submission:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error while processing your request' 
      });
    }
  },

  /**
   * Submit organization assessment data
   * @route POST /api/assessment/organization
   */
  submitOrganizationAssessment: async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extract form data from request body
      const { 
        companyName, 
        contactName, 
        contactEmail, 
        contactPhone, 
        companySize, 
        industry, 
        challengeArea, 
        message,
        organizationType,
        yearsFounded,
        teamSize,
        linkedinUrl,
        category,
        assessmentType
      } = req.body;

      console.log('Received organization assessment:', { 
        companyName, 
        contactName, 
        contactEmail,
        organizationType,
        category 
      });
      
      // Create new assessment entry in MongoDB
      const assessment = await OrganizationAssessment.create({
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        companySize,
        industry,
        challengeArea,
        message,
        organizationType,
        yearsFounded,
        teamSize,
        linkedinUrl,
        category,
        assessmentType: assessmentType || 'organization',
        responseData: {}
      });

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Organization assessment information submitted successfully',
        data: assessment
      });
    } catch (error) {
      console.error('Error in organization assessment submission:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error while processing your request' 
      });
    }
  },
  /**
   * Update individual assessment with responses
   * @route PUT /api/assessment/individual/:id
   */
  updateIndividualAssessment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { responseData } = req.body;

      // Enhanced logging for debugging
      console.log('Updating assessment with ID:', id);
      console.log('Response data received:', JSON.stringify(responseData, null, 2));

      // Validate that the responseData contains answers
      if (!responseData || !responseData.answers) {
        console.warn('Response data missing answers property:', responseData);
        return res.status(400).json({
          success: false,
          message: 'Invalid response data format - answers property is missing'
        });
      }

      // Count the number of questions answered
      const questionCount = Object.keys(responseData.answers).length;
      console.log(`Number of questions answered: ${questionCount}`);      
      
      // Add metadata for student assessments if it exists
      if (responseData.assessmentType && responseData.assessmentType.includes('9-10')) {
        console.log('Identified as student 9-10 assessment, adding additional metadata');
      }
      
      console.log('Using direct MongoDB update for reliability');
        // Use direct MongoDB update for maximum reliability
      const result = await IndividualAssessment.updateOne(
        { _id: id },
        { 
          $set: { 
            responseData: responseData,
            completedAt: new Date(),
            completed: true
          }
        },
        { upsert: false }
      );
      
      console.log('Update result:', result);
      
      if (result.matchedCount === 0) {
        console.error(`Assessment not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }
      
      if (result.modifiedCount === 0) {
        console.warn(`Assessment found but not modified. ID: ${id}`);
      }
      
      // Verify the update worked by fetching it again
      const updatedAssessment = await IndividualAssessment.findById(id);
      
      if (updatedAssessment) {
        console.log('Assessment found after update:', updatedAssessment._id);
        console.log('Assessment document keys:', Object.keys(updatedAssessment.toObject()));
        console.log('Response data exists:', updatedAssessment.responseData !== undefined);
        if (updatedAssessment.responseData) {
          console.log('Response data fields:', Object.keys(updatedAssessment.responseData));
        }
      }      
      
      res.status(200).json({
        success: true,
        message: 'Assessment responses saved successfully',
        data: {
          id: id,
          questionCount: questionCount,
          categories: responseData.categories ? Object.keys(responseData.categories).length : 0,
          completedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating individual assessment:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while processing your request'
      });
    }
  },
  /**
   * Update organization assessment with responses
   * @route PUT /api/assessment/organization/:id
   */
  updateOrganizationAssessment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { responseData } = req.body;

      // Enhanced logging for debugging
      console.log('Updating organization assessment with ID:', id);
      console.log('Response data received:', JSON.stringify(responseData, null, 2));

      // Validate that the responseData contains answers if expected
      if (!responseData) {
        console.warn('Response data is empty or invalid:', responseData);
        return res.status(400).json({
          success: false,
          message: 'Invalid response data format'
        });
      }      console.log('Using direct MongoDB update for reliability');
      
      // Use direct MongoDB update for maximum reliability
      const result = await OrganizationAssessment.updateOne(
        { _id: id },
        { $set: { responseData: responseData } },
        { upsert: false }
      );
      
      console.log('Update result:', result);
      
      if (result.matchedCount === 0) {
        console.error(`Organization assessment not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }
      
      if (result.modifiedCount === 0) {
        console.warn(`Organization assessment found but not modified. ID: ${id}`);
      }
      
      // Verify the update worked by fetching it again
      const updatedAssessment = await OrganizationAssessment.findById(id);
      
      if (updatedAssessment) {
        console.log('Organization assessment updated successfully:', updatedAssessment._id);
        console.log('Response data fields:', Object.keys(updatedAssessment.responseData || {}));
      }      res.status(200).json({
        success: true,
        message: 'Assessment responses saved successfully',
        data: {
          id: id,
          responseData: responseData ? 'Received' : 'Not provided'
        }
      });
    } catch (error) {
      console.error('Error updating organization assessment:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while processing your request'
      });
    }
  }
};
