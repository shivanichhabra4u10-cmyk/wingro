import { Request, Response } from 'express';
import { Contact } from '../models';
import { validationResult } from 'express-validator';

export const contactController = {
  /**
   * Submit contact form
   * @route POST /api/contact
   */
  submitContactForm: async (req: Request, res: Response) => {
    try {      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extract form data from request body
      const { name, email, phoneNumber, subject, interestedIn, message } = req.body;

      // Create new contact entry in MongoDB
      const contactEntry = await Contact.create({
        name,
        email,
        phoneNumber, // Include phone number if provided
        subject,
        interestedIn,
        message
      });

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Contact Shivani form submitted successfully',
        data: contactEntry
      });
    } catch (error) {
      console.error('Error in contact form submission:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error while processing your request' 
      });
    }
  },

  /**
   * Get all contact form submissions (admin only)
   * @route GET /api/contact
   */
  getAllContactSubmissions: async (req: Request, res: Response) => {
    try {
      const contactSubmissions = await Contact.find().sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: contactSubmissions.length,
        data: contactSubmissions
      });
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error while fetching contact submissions' 
      });
    }
  }
};
