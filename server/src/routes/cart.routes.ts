import { Router } from 'express';
import { getCart, saveCart, clearCart } from '../controllers/cart.controller';
import { validateJWT } from '../middleware/auth';

const router = Router();

// Get cart for logged-in user
router.get('/', validateJWT, getCart);

// Save/update cart for logged-in user
router.post('/', validateJWT, saveCart);

// Clear cart after purchase
router.post('/clear', validateJWT, clearCart);

export default router;
