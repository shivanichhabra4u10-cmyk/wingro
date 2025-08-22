import express from 'express';
import { productController } from '../controllers';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes - accessible by anyone
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);


// Protected routes - requires authentication & admin role
router.post('/', authMiddleware.protect, authMiddleware.adminOnly, productController.createProduct);
router.put('/:id', authMiddleware.protect, authMiddleware.adminOnly, productController.updateProduct);
router.delete('/:id', authMiddleware.protect, authMiddleware.adminOnly, productController.deleteProduct);
router.delete('/:id/hard', authMiddleware.protect, authMiddleware.adminOnly, productController.hardDeleteProduct);

export default router;
