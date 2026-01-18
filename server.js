import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Enable gzip compression
app.use(cors());
app.use(bodyParser.json());

// Cache control middleware for static assets
const staticCacheMiddleware = (req, res, next) => {
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(req.path);
  const isFont = /\.(woff|woff2|ttf|otf|eot)$/i.test(req.path);
  const isCritical = req.path === '/index.html' || req.path === '/';
  
  if (isImage || isFont) {
    // Cache images and fonts for 30 days (long-term cache)
    res.set('Cache-Control', 'public, max-age=2592000, immutable');
  } else if (isCritical) {
    // Don't cache HTML to ensure fresh content
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else {
    // Cache other assets for 7 days
    res.set('Cache-Control', 'public, max-age=604800');
  }
  next();
};

app.use(staticCacheMiddleware);

// WebP image format negotiation middleware
app.get(/\.(jpg|jpeg|png)$/i, (req, res, next) => {
  const acceptWebP = req.get('Accept')?.includes('image/webp');
  if (!acceptWebP) {
    next();
    return;
  }
  
  const webpPath = req.path.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const fullPath = path.join(__dirname, webpPath);
  
  if (fs.existsSync(fullPath)) {
    res.set('Content-Type', 'image/webp');
    res.sendFile(fullPath);
  } else {
    next();
  }
});

// Image optimization headers middleware
app.use((req, res, next) => {
  // Add early hints for faster resource discovery
  if (/\.(jpg|jpeg|png|webp|gif)$/i.test(req.path)) {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Link', '<' + req.path + '>; rel=preload; as=image');
  }
  next();
});

// Serve static files from root directory (HTML pages) and Public directory (assets)
app.use(express.static(__dirname, { 
  maxAge: '30d',
  etag: false // Let compression handle efficiency
}));
app.use(express.static(path.join(__dirname, 'Public'), { 
  maxAge: '30d',
  etag: false
}));

// Orders persistence (dev-only JSON file)
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
let orders = [];

// Load existing orders from file if present
try {
  if (fs.existsSync(ORDERS_FILE)) {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    orders = JSON.parse(raw) || [];
  }
} catch (e) {
  console.warn('Could not read orders file:', e && e.message ? e.message : e);
}

const generateOrderNumber = () => {
  const d = new Date();
  const date = d.toISOString().slice(0,10).replace(/-/g,''); // YYYYMMDD
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AM-${date}-${rand}`;
};

// Serve the main HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API to submit order - validates payload and appends to data/orders.json
app.post('/api/orders', (req, res) => {
  try {
    const { customerDetails, cart, paymentMethod } = req.body || {};
    if (!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address || !customerDetails.city) {
      return res.status(400).json({ success: false, message: 'Missing customer details' });
    }
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const orderNumber = generateOrderNumber();
    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const order = {
      id: orderNumber,
      order_number: orderNumber,
      customer: customerDetails,
      items: cart,
      payment_method: paymentMethod || 'cod',
      total_cents: total,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    orders.push(order);

    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');

    return res.json({ success: true, orderId: orderNumber });
  } catch (err) {
    console.error('Order save error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API to get orders (dev-only admin)
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// API to get products
app.get('/api/products', (req, res) => {
  const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      const products = JSON.parse(raw);
      return res.json(products);
    }
    return res.status(404).json({ success: false, message: 'Products not found' });
  } catch (e) {
    console.warn('Could not read products file:', e && e.message ? e.message : e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Expose configuration to client
app.get('/api/config', (req, res) => {
  const config = {
    // EmailJS Configuration
    emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || null,
    serviceId: process.env.EMAILJS_SERVICE_ID || null,
    templateAdmin: process.env.EMAILJS_TEMPLATE_ADMIN || null,
    templateCustomer: process.env.EMAILJS_TEMPLATE_CUSTOMER || null,
    
    // Contact Information
    whatsappNumber: process.env.WHATSAPP_NUMBER || '923268502690',
    supportEmail: process.env.SUPPORT_EMAIL || 'alfmart.store@gmail.com',
    supportPhone: process.env.SUPPORT_PHONE || '03268502690',
    
    // Bank Details
    bank: {
      name: process.env.BANK_NAME || 'Meezan Bank',
      accountTitle: process.env.BANK_ACCOUNT_TITLE || 'MUHAMMAD AHMAD',
      accountNumber: process.env.BANK_ACCOUNT_NUMBER || '02780113523044',
      iban: process.env.BANK_IBAN || 'PK98MEZN0002780113523044',
      branch: process.env.BANK_BRANCH || 'Avian Chowk Br Lahore'
    }
  };
  res.json(config);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});