/**
 * ENHANCED PRODUCTS API WITH V1 ROUTE SUPPORT
 * 
 * This adds support for /v1/products and /api/v1/products endpoints.
 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Data storage - use a simple JSON file instead of MongoDB
const PRODUCTS_FILE = path.join(__dirname, 'products-data.json');

// Initialize the data file if it doesn't exist
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify({
    products: [
      {
        _id: '1',
        name: "Market Validation Kit",
        description: "Complete PMF analysis with AI-driven insights",
        price: 599,
        oldPrice: 999,
        badge: "AI-Powered",
        category: "digital",
        productType: "individual",
        images: [
          "https://placehold.co/600x400/94a3b8/FFFFFF?text=Market+Validation+Dashboard",
          "https://placehold.co/600x400/a1a1aa/FFFFFF?text=PMF+Analysis+Tool"
        ],
        features: ["Feature 1", "Feature 2"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: "GTM Strategy Playbook",
        description: "Launch & pricing strategies that work",
        price: 599,
        badge: "Best Seller",
        category: "digital",
        productType: "individual",
        images: [
          "https://placehold.co/600x400/a3e635/FFFFFF?text=GTM+Strategy+Framework", 
          "https://placehold.co/600x400/bef264/FFFFFF?text=Pricing+Model+Calculator"
        ],
        features: ["Feature 1", "Feature 2"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '3',
        name: "InvestorIQ Engine",
        description: "AI-powered investor matchmaking",
        price: 599,
        badge: "Premium",
        category: "digital",
        productType: "enterprise",
        images: [
          "https://placehold.co/600x400/c4b5fd/FFFFFF?text=Investor+Matching+Engine", 
          "https://placehold.co/600x400/d8b4fe/FFFFFF?text=Funding+Opportunity+Radar"
        ],
        features: ["Feature 1", "Feature 2"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }, null, 2));
}

// Helper functions to read/write data
const readProducts = () => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return { products: [] };
  }
};

const writeProducts = (data) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Products API is running with v1 routes' });
});

// Main API routes - Support all common path variants

// GET all products with pagination, limits and sorting
const getAllProducts = (req, res) => {
  const data = readProducts();
  const { productType, category, limit = 5, page = 1, sortBy = 'createdAt', sortOrder = -1 } = req.query;

  // Parse numeric parameters
  const parsedLimit = parseInt(limit) || 100;
  const parsedPage = parseInt(page) || 1;
  const skip = (parsedPage - 1) * parsedLimit;
  const parsedSortOrder = sortOrder === '-1' || sortOrder === -1 ? -1 : 1;
  
  // Filter active products
  let products = data.products.filter(p => p.isActive);
  
  // Apply filters if provided
  if (productType) {
    products = products.filter(p => p.productType === productType);
  }
  
  if (category) {
    products = products.filter(p => p.category === category);
  }

  // Calculate total before pagination
  const totalCount = products.length;
  
  // Sort products
  products.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle various data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return parsedSortOrder === 1 ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else {
      // For numbers, dates, etc.
      if (aValue < bValue) return parsedSortOrder === 1 ? -1 : 1;
      if (aValue > bValue) return parsedSortOrder === 1 ? 1 : -1;
      return 0;
    }
  });

  // Apply pagination with maximized limit
  products = products.slice(skip, skip + Math.min(parsedLimit, 1000));
  
  return res.status(200).json({
    success: true,
    count: products.length,
    totalCount: totalCount,
    page: parsedPage,
    totalPages: Math.ceil(totalCount / parsedLimit),
    hasMore: skip + products.length < totalCount,
    data: products
  });
};

// GET product by ID
const getProductById = (req, res) => {
  const { id } = req.params;
  const data = readProducts();
  
  const product = data.products.find(p => p._id === id && p.isActive);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  return res.status(200).json({
    success: true,
    data: product
  });
};

// Create new product
const createProduct = (req, res) => {
  const data = readProducts();

  // Validate images array
  if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one product image is required.'
    });
  }

  const newProduct = {
    _id: Date.now().toString(),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.products.push(newProduct);

  if (writeProducts(data)) {
    return res.status(201).json({
      success: true,
      data: newProduct
    });
  } else {
    return res.status(500).json({
      success: false,
      error: 'Error creating product'
    });
  }
};

// Update product
const updateProduct = (req, res) => {
  const { id } = req.params;
  const data = readProducts();
  
  const productIndex = data.products.findIndex(p => p._id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  const updatedProduct = {
    ...data.products[productIndex],
    ...req.body,
    _id: id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  data.products[productIndex] = updatedProduct;
  
  if (writeProducts(data)) {
    return res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } else {
    return res.status(500).json({
      success: false,
      error: 'Error updating product'
    });
  }
};

// Soft Delete product
const deleteProduct = (req, res) => {
  const { id } = req.params;
  const data = readProducts();
  
  const productIndex = data.products.findIndex(p => p._id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  // Soft delete - mark as inactive
  data.products[productIndex].isActive = false;
  data.products[productIndex].updatedAt = new Date().toISOString();
  
  if (writeProducts(data)) {
    return res.status(200).json({
      success: true,
      data: data.products[productIndex]
    });
  } else {
    return res.status(500).json({
      success: false,
      error: 'Error deleting product'
    });
  }
};

// Hard Delete product
const hardDeleteProduct = (req, res) => {
  const { id } = req.params;
  const data = readProducts();
  
  const productIndex = data.products.findIndex(p => p._id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  // Hard delete - remove from array
  const deletedProduct = data.products.splice(productIndex, 1)[0];
  
  if (writeProducts(data)) {
    return res.status(200).json({
      success: true,
      data: { _id: id, deleted: true }
    });
  } else {
    return res.status(500).json({
      success: false,
      error: 'Error deleting product'
    });
  }
};

// Register original routes
app.get('/products', getAllProducts);
app.get('/api/products', getAllProducts);
app.get('/products/:id', getProductById);
app.get('/api/products/:id', getProductById);
app.post('/products', createProduct);
app.post('/api/products', createProduct);
app.put('/products/:id', updateProduct);
app.put('/api/products/:id', updateProduct);
app.delete('/products/:id', deleteProduct);
app.delete('/api/products/:id', deleteProduct);
app.delete('/products/:id/hard', hardDeleteProduct);
app.delete('/api/products/:id/hard', hardDeleteProduct);

// Register v1 routes to match client API expectations
app.get('/v1/products', getAllProducts);
app.get('/api/v1/products', getAllProducts);
app.get('/v1/products/:id', getProductById);
app.get('/api/v1/products/:id', getProductById);
app.post('/v1/products', createProduct);
app.post('/api/v1/products', createProduct);
app.put('/v1/products/:id', updateProduct);
app.put('/api/v1/products/:id', updateProduct);
app.delete('/v1/products/:id', deleteProduct);
app.delete('/api/v1/products/:id', deleteProduct);
app.delete('/v1/products/:id/hard', hardDeleteProduct);
app.delete('/api/v1/products/:id/hard', hardDeleteProduct);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Products API Server running on http://localhost:${PORT}`);
  console.log(`Products API endpoints:`);
  console.log(`- GET  /api/products, /api/v1/products, /v1/products, /products`);
  console.log(`- GET  /api/products/:id, /api/v1/products/:id, /v1/products/:id, /products/:id`);
  console.log(`- POST /api/products, /api/v1/products, /v1/products, /products`);
  console.log(`- PUT  /api/products/:id, /api/v1/products/:id, /v1/products/:id, /products/:id`);
  console.log(`- DEL  /api/products/:id, /api/v1/products/:id, /v1/products/:id, /products/:id`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server has been terminated');
    process.exit(0);
  });
});

module.exports = server; // For testing purposes
