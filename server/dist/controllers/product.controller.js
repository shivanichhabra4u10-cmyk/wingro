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
exports.productController = void 0;
const models_1 = require("../models");
const mongoose_1 = __importDefault(require("mongoose"));
exports.productController = {
    // Get all products (with pagination)
    getAllProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { productType, category, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1 } = req.query;
            // Build query filter based on provided query parameters
            const filter = { isActive: true };
            if (productType) {
                filter.productType = productType;
            }
            if (category) {
                filter.category = category;
            }
            // Parse pagination params
            const parsedLimit = parseInt(limit) || 10;
            const parsedPage = parseInt(page) || 1;
            const skip = (parsedPage - 1) * parsedLimit;
            // Get total count for pagination info
            const totalCount = yield models_1.Product.countDocuments(filter);
            // Create sort object
            const sort = {};
            sort[sortBy] = sortOrder === '-1' || sortOrder === -1 ? -1 : 1;
            // Execute query with pagination
            const products = yield models_1.Product.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(Math.min(parsedLimit, 100)); // Maximum 100 products per request
            // Transform products: map _id to id, remove _id and __v
            const cleanProducts = products.map((p) => {
                const obj = p.toObject();
                obj.id = obj._id;
                delete obj._id;
                delete obj.__v;
                return obj;
            });
            return res.status(200).json({
                success: true,
                count: cleanProducts.length,
                totalCount,
                page: parsedPage,
                totalPages: Math.ceil(totalCount / parsedLimit),
                hasMore: skip + cleanProducts.length < totalCount,
                data: cleanProducts
            });
        }
        catch (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }),
    // Get single product by ID
    getProductById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Disable caching for product detail endpoint
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
            res.set('Surrogate-Control', 'no-store');
            const productId = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid product ID'
                });
            }
            const product = yield models_1.Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            // Transform product: map _id to id, remove _id and __v
            const obj = product.toObject();
            obj.id = obj._id;
            delete obj._id;
            if (obj && '__v' in obj)
                delete obj.__v;
            return res.status(200).json({
                success: true,
                data: obj
            });
        }
        catch (error) {
            console.error('Error fetching product:', error);
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }),
    // Create new product
    createProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, description, price, category, productType, files = [] } = req.body;
            // Basic validation
            if (!name || !description || !price || !category || !productType) {
                return res.status(400).json({
                    success: false,
                    error: 'Please provide all required fields'
                });
            }
            // Validate files array structure
            let validatedFiles = [];
            if (Array.isArray(files)) {
                validatedFiles = files.filter((f) => f && typeof f.url === 'string' && f.url.length > 0);
            }
            // Always set files to an array (even if empty)
            const productData = Object.assign(Object.assign({}, req.body), { files: validatedFiles });
            if (!Array.isArray(productData.files))
                productData.files = [];
            if (typeof productData.badge === 'undefined' || productData.badge === null) {
                productData.badge = '';
            }
            const product = yield models_1.Product.create(productData);
            // Always fetch the product after creation to ensure all fields (including files) are present
            let freshProduct = yield models_1.Product.findById(product._id).lean();
            if (!(freshProduct === null || freshProduct === void 0 ? void 0 : freshProduct.files))
                freshProduct.files = [];
            return res.status(201).json({
                success: true,
                data: freshProduct
            });
        }
        catch (error) {
            console.error('Error creating product:', error);
            // Handle duplicate key error
            if (error instanceof Error && error.name === 'MongoError' && error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    error: 'A product with this name already exists'
                });
            }
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }),
    // Update product
    updateProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('--- [DEBUG] Incoming update payload:', JSON.stringify(req.body, null, 2));
        try {
            const productId = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid product ID'
                });
            }
            const product = yield models_1.Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            // Validate files array structure if present
            let updateData = Object.assign({}, req.body);
            if (Array.isArray(updateData.files)) {
                updateData.files = updateData.files.filter((f) => f && typeof f.url === 'string' && f.url.length > 0);
            }
            // Always set files to an array (even if empty)
            if (!Array.isArray(updateData.files))
                updateData.files = [];
            const updatedProduct = yield models_1.Product.findByIdAndUpdate(productId, { $set: updateData }, { new: true, runValidators: true });
            console.log('--- [DEBUG] Product after update:', JSON.stringify(updatedProduct, null, 2));
            // Always fetch the product after update to ensure all fields (including files) are present
            let freshProduct = yield models_1.Product.findById(productId).lean();
            if (!(freshProduct === null || freshProduct === void 0 ? void 0 : freshProduct.files))
                freshProduct.files = [];
            return res.status(200).json({
                success: true,
                data: freshProduct
            });
        }
        catch (error) {
            console.error('Error updating product:', error);
            // Handle duplicate key error
            if (error instanceof Error && error.name === 'MongoError' && error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    error: 'A product with this name already exists'
                });
            }
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }),
    // Delete product (soft delete by setting isActive to false)
    deleteProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productId = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid product ID'
                });
            }
            const product = yield models_1.Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            // Soft delete by setting isActive to false
            const updatedProduct = yield models_1.Product.findByIdAndUpdate(productId, { $set: { isActive: false } }, { new: true });
            return res.status(200).json({
                success: true,
                data: updatedProduct,
                message: 'Product has been deactivated'
            });
        }
        catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }),
    // Hard delete product - for admin use only
    hardDeleteProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productId = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid product ID'
                });
            }
            yield models_1.Product.findByIdAndDelete(productId);
            return res.status(200).json({
                success: true,
                message: 'Product has been permanently deleted'
            });
        }
        catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    })
};
