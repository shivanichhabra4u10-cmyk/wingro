import { Response } from 'express';
import { RequestWithUser } from '../middleware/auth';
import { User } from '../models/User';

// Get cart for logged-in user
export const getCart = async (req: RequestWithUser, res: Response) => {
  try {
  if (!req.user || !req.user.userId) return res.status(401).json({ error: 'Unauthorized' });
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ cart: (user as any).cart || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Save/update cart for logged-in user
export const saveCart = async (req: RequestWithUser, res: Response) => {
  try {
  if (!req.user || !req.user.userId) return res.status(401).json({ error: 'Unauthorized' });
  const userId = req.user.userId;
    const cart = req.body.cart || [];
    const user = await User.findByIdAndUpdate(userId, { cart }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ cart: (user as any).cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save cart' });
  }
};

// Clear cart after purchase
export const clearCart = async (req: RequestWithUser, res: Response) => {
  try {
  if (!req.user || !req.user.userId) return res.status(401).json({ error: 'Unauthorized' });
  const userId = req.user.userId;
    const user = await User.findByIdAndUpdate(userId, { cart: [] }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ cart: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
