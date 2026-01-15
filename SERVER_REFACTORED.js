/**
 * AlfMart Express Server
 * Main server entry point for the e-commerce platform
 * 
 * Features:
 * - Static file serving
 * - API endpoints for products, orders, and configuration
 * - CORS support
 * - JSON request parsing
 * - Order persistence
 * 
 * @author Senior Developer
 * @version 1.0.0
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ============================================================================
// CONFIGURATION
// ============================================================================
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Enable CORS for cross-origin requests
app.use(cors());

// Parse incoming JSON requests (increased limit for large payloads)
app.use(bodyParser.json({ limit: '50mb' }));

// Serve static files from root directory (HTML, CSS, JS)
app.use(express.static(__dirname));

// Serve product images from Public directory
app.use(express.static(path.join(__dirname, 'Public')));

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
let orders = [];

/**
 * Load existing orders from persistent storage
 * Gracefully handles missing or corrupted files
 */
const loadOrders = () => {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const rawData = fs.readFileSync(ORDERS_FILE, 'utf8');
      orders = JSON.parse(rawData) || [];
      console.log(`✓ Loaded ${orders.length} existing orders`);
    }
  } catch (error) {
    console.warn('⚠ Warning: Could not load orders file, starting fresh:', error.message);
    orders = [];
  }
};

/**
 * Save orders to persistent storage
 * Ensures data persists between server restarts
 */
const saveOrders = () => {
  try {
    const dataDir = path.dirname(ORDERS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.error('✗ Error saving orders:', error.message);
  }
};

// Initialize orders on startup
loadOrders();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique order number
 * Format: AM-YYYYMMDD-XXXX (e.g., AM-20250115-4523)
 * @returns {string} Unique order ID
 */
const generateOrderNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `AM-${dateStr}-${randomNum}`;
};

/**
 * Validate required order fields
 * @param {Object} customerDetails - Customer information
 * @returns {Object} Validation result with errors array
 */
const validateOrderData = (customerDetails) => {
  const errors = [];

  if (!customerDetails) {
    return { valid: false, errors: ['No customer details provided'] };
  }

  if (!customerDetails.name || customerDetails.name.trim() === '') {
    errors.push('Full name is required');
  }

  if (!customerDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
    errors.push('Valid email is required');
  }

  if (!customerDetails.phone || customerDetails.phone.trim() === '') {
    errors.push('Phone number is required');
  }

  if (!customerDetails.address || customerDetails.address.trim() === '') {
    errors.push('Delivery address is required');
  }

  if (!customerDetails.city || customerDetails.city.trim() === '') {
    errors.push('City is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// ============================================================================
// ROUTES - STATIC PAGES
// ============================================================================

/**
 * Serve the main homepage
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * Fallback for SPA routing - serve index.html for unknown routes
 */
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// ============================================================================
// API ROUTES - PRODUCTS
// ============================================================================

/**
 * GET /api/products
 * Retrieve all products from inventory
 * @returns {Array} Array of product objects
 */
app.get('/api/products', (req, res) => {
  try {
    const productsPath = path.join(__dirname, 'data', 'products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    res.json(products);
  } catch (error) {
    console.error('Error loading products:', error.message);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// ============================================================================
// API ROUTES - ORDERS
// ============================================================================

/**
 * POST /api/orders
 * Create a new order with validation
 * 
 * Request body:
 * {
 *   customerDetails: { name, email, phone, address, city },
 *   cart: [{ id, name, price, selectedColor, quantity }],
 *   paymentMethod: 'cod' | 'bank',
 *   total: number
 * }
 * 
 * @returns {Object} Order confirmation with ID
 */
app.post('/api/orders', (req, res) => {
  try {
    const { customerDetails, cart, paymentMethod, total } = req.body;

    // Validate customer details
    const validation = validateOrderData(customerDetails);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    // Validate cart
    if (!cart || cart.length === 0) {
      return res.status(400).json({
        success: false,
        errors: ['Cart is empty']
      });
    }

    // Create order object
    const order = {
      id: generateOrderNumber(),
      timestamp: new Date().toISOString(),
      status: 'pending',
      customer: customerDetails,
      items: cart,
      paymentMethod: paymentMethod || 'cod',
      total: total || 0
    };

    // Store order
    orders.push(order);
    saveOrders();

    console.log(`✓ Order created: ${order.id}`);

    // Return success response
    res.status(201).json({
      success: true,
      orderId: order.id,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Error processing order:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process order'
    });
  }
});

/**
 * GET /api/orders/:orderId
 * Retrieve specific order by ID
 * 
 * @param {string} orderId - Order ID (e.g., AM-20250115-4523)
 * @returns {Object} Order details
 */
app.get('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error retrieving order:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order'
    });
  }
});

/**
 * GET /api/orders
 * Retrieve all orders (admin use)
 * 
 * @returns {Array} All orders
 */
app.get('/api/orders', (req, res) => {
  try {
    res.json({
      success: true,
      orders: orders.map(order => ({
        ...order,
        // Don't expose full customer details in list view
        customer: {
          name: order.customer.name,
          email: order.customer.email
        }
      }))
    });
  } catch (error) {
    console.error('Error retrieving orders:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders'
    });
  }
});

// ============================================================================
// API ROUTES - CONFIGURATION
// ============================================================================

/**
 * GET /api/config
 * Retrieve application configuration
 * Includes EmailJS credentials, contact info, bank details
 * 
 * @returns {Object} Configuration object
 */
app.get('/api/config', (req, res) => {
  try {
    const config = {
      // EmailJS Configuration
      emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || null,
      serviceId: process.env.EMAILJS_SERVICE_ID || null,
      templateAdmin: process.env.EMAILJS_TEMPLATE_ADMIN || null,
      templateCustomer: process.env.EMAILJS_TEMPLATE_CUSTOMER || null,

      // Support Contact Information
      supportEmail: process.env.SUPPORT_EMAIL || 'alfmart.store@gmail.com',
      supportPhone: process.env.SUPPORT_PHONE || '03268502690',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '923268502690',

      // Bank Details for Transfer
      bank: {
        name: process.env.BANK_NAME || 'Meezan Bank',
        accountTitle: process.env.BANK_ACCOUNT_TITLE || 'MUHAMMAD AHMAD',
        accountNumber: process.env.BANK_ACCOUNT_NUMBER || '02780113523044',
        iban: process.env.BANK_IBAN || 'PK98MEZN0002780113523044',
        branch: process.env.BANK_BRANCH || 'Avian Chowk Br Lahore'
      },

      // Application Settings
      appName: 'AlfMart',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production'
    };

    res.json(config);
  } catch (error) {
    console.error('Error retrieving config:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve configuration'
    });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * 404 Not Found handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Start the Express server
 */
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           🛍️  AlfMart E-Commerce Server                  ║
║                                                           ║
║  ✓ Server running on http://localhost:${PORT}               ║
║  ✓ API: http://localhost:${PORT}/api                       ║
║  ✓ Products: http://localhost:${PORT}/api/products         ║
║  ✓ Orders: http://localhost:${PORT}/api/orders             ║
║  ✓ Config: http://localhost:${PORT}/api/config             ║
║                                                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}                        ║
║  Orders loaded: ${orders.length}                                  ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
