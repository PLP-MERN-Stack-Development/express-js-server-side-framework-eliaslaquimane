// server import module
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'supersecretkey';

// Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}
class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}
class AuthError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// Async handler to catch errors in async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware setup
app.use(bodyParser.json()); 

// Request logger middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the product API! Use /api/products for product operations');
});

// Authentication middleware
const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return next(new AuthError('Unauthorized - Invalid API key'));
  }
  next();
};

// Validation middleware for creating a product (POST)
const validateCreateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || price === undefined || !category || inStock === undefined) {
    return next(new ValidationError('All input fields are required: name, description, price, category, inStock'));
  }
  if (typeof name !== 'string' || typeof description !== 'string' || typeof category !== 'string') {
    return next(new ValidationError('name, description, and category must be strings'));
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    return next(new ValidationError('price must be a non-negative number'));
  }
  if (typeof inStock !== 'boolean') {
    return next(new ValidationError('inStock must be a boolean'));
  }
  next();
};

// Validation middleware for updating a product (PUT) 
const validateUpdateProduct = (req, res, next) => {

  const { name, description, price, category, inStock } = req.body;
  if (name !== undefined && typeof name !== 'string') {
    return next(new ValidationError('name must be a string'));
  }
  if (description !== undefined && typeof description !== 'string') {
    return next(new ValidationError('description must be a string'));
  }
  if (category !== undefined && typeof category !== 'string') {
    return next(new ValidationError('category must be a string'));
  }
  if (price !== undefined && (typeof price !== 'number' || Number.isNaN(price) || price < 0)) {
    return next(new ValidationError('price must be a non-negative number'));
  }
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    return next(new ValidationError('inStock must be a boolean'));
  }
  // require at least one field to update
  if (Object.keys(req.body).length === 0) {
    return next(new ValidationError('At least one field must be provided for update'));
  }
  next();
};

// Utility: find product by id
const findProductById = (id) => products.find(p => p.id === String(id));

// GET /api/products - list products with filtering, search, pagination
app.get('/api/products', asyncHandler(async (req, res) => {
  let result = [...products];

  // Filtering by category
  if (req.query.category) {
    const category = String(req.query.category).toLowerCase();
    result = result.filter(p => p.category.toLowerCase() === category);
  }

  // Search by name 
  const q = req.query.q || req.query.name;
  if (q) {
    const term = String(q).toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(term));
  }

  // Pagination
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = result.slice(start, end);

  res.json({
    page,
    limit,
    total: result.length,
    results: paginated
  });
}));

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', asyncHandler(async (req, res, next) => {
  const product = findProductById(req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
}));

// POST /api/products - Create a new product 
app.post('/api/products', requireApiKey, validateCreateProduct, asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };
  products.push(newProduct);
  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
}));

// PUT /api/products/:id - Update a product 
app.put('/api/products/:id', requireApiKey, validateUpdateProduct, asyncHandler(async (req, res, next) => {
  const product = findProductById(req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  const updatableFields = ['name', 'description', 'price', 'category', 'inStock'];
  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });
  res.json({ message: 'Product updated successfully', product });
}));

// DELETE /api/products/:id - Delete a product 
app.delete('/api/products/:id', requireApiKey, asyncHandler(async (req, res, next) => {
  const product = findProductById(req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  products = products.filter(p => p.id !== product.id);
  res.json({ message: 'Product deleted successfully' });
}));

// GET /api/products/search - alternative search endpoint 
app.get('/api/products/search', asyncHandler(async (req, res) => {
  const q = req.query.q || req.query.name || '';
  const term = String(q).toLowerCase();
  const results = products.filter(p => p.name.toLowerCase().includes(term));
  res.json({ total: results.length, results });
}));

// GET /api/products/stats - statistics (count by category)
app.get('/api/products/stats', asyncHandler(async (req, res) => {
  const stats = products.reduce((acc, p) => {
    acc.total = (acc.total || 0) + 1;
    acc.byCategory = acc.byCategory || {};
    acc.byCategory[p.category] = (acc.byCategory[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json({ total: stats.total || 0, byCategory: stats.byCategory || {} });
}));

// Global Error Handler
app.use((err, req, res, next) => {
  if (!(err instanceof AppError)) {
    console.error('Unexpected error:', err);
    err = new AppError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
  res.status(err.statusCode).json({ message: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;