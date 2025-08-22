import { Request, Response } from 'express';
import UserPlan from '../models/UserPlan';

export const createUserPlan = async (req: Request, res: Response) => {
  try {
    const { userId, planId, assessmentType } = req.body;
    if (!userId || !planId || !assessmentType) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const userPlan = await UserPlan.create({ userId, planId, assessmentType });
    res.status(201).json({ userPlan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user plan.' });
  }
};

export const getUserPlan = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userPlan = await UserPlan.findOne({ userId });
    if (!userPlan) return res.status(404).json({ error: 'User plan not found.' });
    res.json({ userPlan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user plan.' });
  }
};
