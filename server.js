require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

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
    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
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

// Expose non-sensitive EmailJS config to client
app.get('/api/config', (req, res) => {
  const config = {
    emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || null,
    serviceId: process.env.EMAILJS_SERVICE_ID || null,
    templateAdmin: process.env.EMAILJS_TEMPLATE_ADMIN || null,
    templateCustomer: process.env.EMAILJS_TEMPLATE_CUSTOMER || null,
    contactEmail: process.env.CONTACT_EMAIL || null
  };
  res.json(config);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});