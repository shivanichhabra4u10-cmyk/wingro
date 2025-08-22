"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes - accessible by anyone
router.get('/', controllers_1.productController.getAllProducts);
router.get('/:id', controllers_1.productController.getProductById);
// Protected routes - requires authentication & admin role
router.post('/', auth_1.authMiddleware.protect, auth_1.authMiddleware.adminOnly, controllers_1.productController.createProduct);
router.put('/:id', auth_1.authMiddleware.protect, auth_1.authMiddleware.adminOnly, controllers_1.productController.updateProduct);
router.delete('/:id', auth_1.authMiddleware.protect, auth_1.authMiddleware.adminOnly, controllers_1.productController.deleteProduct);
router.delete('/:id/hard', auth_1.authMiddleware.protect, auth_1.authMiddleware.adminOnly, controllers_1.productController.hardDeleteProduct);
exports.default = router;
