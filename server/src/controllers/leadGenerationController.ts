import { Request, Response } from 'express';
import LeadGeneration from '../models/LeadGeneration';
import path from 'path';
import fs from 'fs';

/**
 * Submit lead generation form
 */
export const submitLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, companyName, email, contactNo, painAreas, interestedInDigitalTwin } = req.body;

    // Validation
    if (!name || !companyName || !email || !contactNo || !painAreas) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
      return;
    }

    // Create new lead
    const newLead = new LeadGeneration({
      name,
      companyName,
      email,
      contactNo,
      painAreas,
      interestedInDigitalTwin: interestedInDigitalTwin || false,
    });

    await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Lead submitted successfully',
      data: {
        id: newLead._id,
        name: newLead.name,
        email: newLead.email,
      },
    });
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit lead',
      error: error.message,
    });
  }
};

/**
 * Download playbook PDF
 */
export const downloadPlaybook = async (req: Request, res: Response): Promise<void> => {
  try {
    // Try multiple possible paths for the PDF
    const possiblePaths = [
      path.join(__dirname, '../../public/sample-playbook.pdf'),
      path.join(process.cwd(), 'public/sample-playbook.pdf'),
      path.join(process.cwd(), 'server/public/sample-playbook.pdf'),
      path.join(__dirname, '../../../public/sample-playbook.pdf'),
    ];

    let pdfPath: string | null = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        pdfPath = testPath;
        console.log('✅ Found PDF at:', testPath);
        break;
      }
    }

    // Check if file exists
    if (!pdfPath) {
      console.error('❌ PDF not found. Tried paths:', possiblePaths);
      res.status(404).json({
        success: false,
        message: 'Playbook PDF not found',
      });
      return;
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=WinGroX-AI-Playbook.pdf');

    // Stream the file
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error('Error downloading playbook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download playbook',
      error: error.message,
    });
  }
};

/**
 * Get all leads (admin only)
 */
export const getAllLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const leads = await LeadGeneration.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      error: error.message,
    });
  }
};
