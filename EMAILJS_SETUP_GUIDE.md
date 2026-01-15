# EmailJS Setup Guide for AlfMart

## Complete Step-by-Step Configuration

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click "Sign Up" and create an account
3. Verify your email
4. Log in to dashboard

### Step 2: Add Email Service
1. In dashboard, go to "Email Services"
2. Click "Add Service"
3. Select your email provider:
   - **Gmail**: Use Gmail address and generate App Password
   - **Other Provider**: Enter SMTP details
4. Complete verification
5. **Copy your Service ID** (looks like: `service_abc123def456`)

### Step 3: Create Email Templates

#### Template 1: Admin Notification
1. Go to "Email Templates" in left menu
2. Click "Create New Template"
3. Template Name: `alfmart_admin_order`
4. Subject: `New Order #{{order_id}} Received`

**Template Body:**
```html
<h2>New Order Received</h2>

<p><strong>Order ID:</strong> {{order_id}}</p>
<p><strong>Customer:</strong> {{customer_name}}</p>
<p><strong>Email:</strong> {{customer_email}}</p>
<p><strong>Phone:</strong> {{customer_phone}}</p>
<p><strong>Address:</strong> {{customer_address}}</p>

<h3>Items Ordered:</h3>
<pre>{{cart_items}}</pre>

<h3>Order Summary:</h3>
<p><strong>Total Amount:</strong> {{total_amount}}</p>
<p><strong>Payment Method:</strong> {{payment_method}}</p>

<p>Customer will receive order confirmation email shortly.</p>
```

5. Click "Save"
6. **Copy Template ID** (looks like: `template_abc123def456`)
7. Store as: `EMAILJS_TEMPLATE_ADMIN`

---

#### Template 2: Customer Confirmation
1. Click "Create New Template" again
2. Template Name: `alfmart_customer_order`
3. Subject: `Order Confirmation - #{{order_id}}`
4. **Email To Field:** `{{to_email}}`  ← IMPORTANT!

**Template Body:**
```html
<h2>Thank You for Your Order!</h2>

<p>Dear {{customer_name}},</p>

<p>Your order has been placed successfully.</p>

<h3>Order Details:</h3>
<p><strong>Order ID:</strong> {{order_id}}</p>
<p><strong>Order Date:</strong> {{order_date}}</p>

<h3>Items Purchased:</h3>
<pre>{{cart_items}}</pre>

<h3>Order Total:</h3>
<p><strong>Amount:</strong> {{total_amount}}</p>

<h3>Delivery Information:</h3>
<p><strong>Delivery To:</strong> {{customer_address}}</p>
<p><strong>Contact:</strong> {{customer_phone}}</p>

<h3>Payment Method:</h3>
<p>{{payment_method}}</p>

<p>We will contact you shortly to confirm your order.</p>

<p>Thank you for shopping at AlfMart!</p>
```

5. Click "Save"
6. **Copy Template ID**
7. Store as: `EMAILJS_TEMPLATE_CUSTOMER`

---

### Step 4: Get Public Key
1. In EmailJS dashboard, click your avatar (top right)
2. Go to "Account" → "General" section
3. Look for "Public Key"
4. **Copy Public Key** (looks like: `pk_live_abc123def456ghi789`)

---

### Step 4.5: Security Configuration (CRITICAL)
1. In EmailJS dashboard, go to "Account" → "Security"
2. **Allowed Origins:** Add your domain (e.g., `http://localhost:3000`, `https://alfmart.com`)
   * *Risk:* If skipped, anyone can use your key to send spam.
3. **CAPTCHA:** Enable "Add CAPTCHA verification"
   * *Risk:* Prevents bots from flooding your email quota.
4. Click "Save Changes"

---

### Step 5: Update .env File

Open `.env` in your project root and add/update:

```env
# EmailJS Configuration
EMAILJS_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
EMAILJS_SERVICE_ID=service_xxxxxxxxxxxxxxxxxxxxx
EMAILJS_TEMPLATE_ADMIN=template_xxxxxxxxxxxxxxxxxxxxx
EMAILJS_TEMPLATE_CUSTOMER=template_xxxxxxxxxxxxxxxxxxxxx
```

**Example (with real values):**
```env
EMAILJS_PUBLIC_KEY=pk_live_1a2b3c4d5e6f7g8h9i0j
EMAILJS_SERVICE_ID=service_abc123def456
EMAILJS_TEMPLATE_ADMIN=template_admin_12345
EMAILJS_TEMPLATE_CUSTOMER=template_customer_12345
```

---

### Step 6: Save .env and Restart Server

```bash
# Stop current server (Ctrl+C if running)

# Restart
npm run dev
```

You should see:
```
[dotenv@17.2.3] injecting env (14) from .env
Server running at http://localhost:3000
```

---

## Testing Your Setup

### Step 1: Test in Browser Console
1. Open http://localhost:3000
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Paste this command:
```javascript
fetch('/api/config').then(r => r.json()).then(c => console.log('Config:', c))
```
5. Press Enter
6. You should see your EmailJS credentials logged

**Expected Output:**
```javascript
Config: {
  emailjsPublicKey: "pk_live_...",
  serviceId: "service_...",
  templateAdmin: "template_...",
  templateCustomer: "template_...",
  whatsappNumber: "923268502690",
  supportEmail: "support@alfmart.com",
  bank: { accountTitle: "...", accountNumber: "..." } // ENSURE NO PRIVATE KEYS HERE!
}
```

### Step 2: Send a Test Email
1. Go to http://localhost:3000
2. Add a product to cart
3. Click "Checkout"
4. Fill in test details:
   ```
   Name: Test User
   Email: your-email@gmail.com (your real email!)
   Phone: +92 300 1234567
   Address: 123 Test Street
   City: Test City
   ```
5. Select "Bank Transfer"
6. Click "Confirm Order"
7. Check browser console for messages like:
   ```
   EmailJS initialized successfully
   EmailJS admin send success
   EmailJS customer send success
   ```
8. Check your email inbox (and spam folder!)
9. You should receive 2 emails:
   - One from your admin email
   - One to your test email address

---

## Troubleshooting

### "EmailJS SDK not loaded"
- [ ] Check if `https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js` is reachable
- [ ] Try opening in different browser
- [ ] Clear cache (Ctrl+Shift+Delete) and reload

### "Missing EmailJS service ID"
- [ ] Your `.env` file doesn't have `EMAILJS_SERVICE_ID`
- [ ] Server didn't load `.env` properly
- [ ] Restart server: `npm run dev`

### "400 Bad Request" Error
- [ ] Template parameter names don't match
- [ ] Check: Does template use `{{customer_address}}` but code sends `customer_address`? (They must match!)
- [ ] Verify `to_email` is in your customer template
- [ ] Check EmailJS template variables match code exactly

### Emails Not Received
1. Check spam/junk folder
2. Verify email address is correct in test
3. Check EmailJS dashboard for failed deliveries:
   - Dashboard → "Logs" tab
   - Look for red "Failed" entries
   - Click to see error details
4. Common issues:
   - Recipient email address is invalid
   - Gmail blocking the email (check email security)
   - Email service not verified in EmailJS

### Template Variables Not Showing
- [ ] In EmailJS editor, template shows: `{{variable}}`
- [ ] In code, sending: `variable: value`
- [ ] They must match exactly!
- [ ] Example:
  ```javascript
  // Template: {{customer_name}}
  // Code: customer_name: customerDetails.value.name  ✓ CORRECT
  
  // Code: customer_full_name: customerDetails.value.name  ✗ WRONG
  // (template won't find {{customer_full_name}})
  ```

---

## Email Template Variables Reference

All available variables you can use in EmailJS templates:

```
{{to_email}}              → Recipient email
{{order_id}}              → Order number
{{customer_name}}         → Customer full name
{{customer_email}}        → Customer email address
{{customer_phone}}        → Customer phone number
{{customer_address}}      → Full delivery address
{{total_amount}}          → Order total (formatted: "PKR 9,999")
{{payment_method}}        → Payment type ("Cash on Delivery" or "Bank Transfer")
{{show_cod}}              → true/false (useful for conditionals)
{{show_bank}}             → true/false (useful for conditionals)
{{cart_items}}            → List of items with prices
```

---

## Security Tips

1. **NEVER** commit `.env` file to GitHub
2. **DO** commit `.env.example` with placeholder values
3. **USE** strong, unique credentials
4. **ROTATE** Public Key if compromised
5. **LIMIT** Email template permissions to send-only
6. **CONFIGURE** "Allowed Origins" in EmailJS dashboard to whitelist your domain (e.g., `alfmart.com`)
7. **ENABLE** CAPTCHA verification in EmailJS to prevent bot spam

---

## Credentials Checklist

Use this to verify you have everything:

```
EMAILJS_PUBLIC_KEY:          [ ] Copied from Account → General
EMAILJS_SERVICE_ID:          [ ] Copied from Email Services
EMAILJS_TEMPLATE_ADMIN:      [ ] Copied from Email Templates (admin template)
EMAILJS_TEMPLATE_CUSTOMER:   [ ] Copied from Email Templates (customer template)

Template Admin:
  [ ] Subject created
  [ ] Variables: {{order_id}}, {{customer_name}}, {{cart_items}}, {{total_amount}}
  [ ] Body has all needed fields

Template Customer:
  [ ] Subject created
  [ ] "To Email" field set to: {{to_email}}
  [ ] Variables: {{order_id}}, {{customer_name}}, {{cart_items}}, {{total_amount}}
  [ ] Body has personalized greeting

.env File:
  [ ] Created in project root
  [ ] All 4 variables added
  [ ] Server restarted after changes
```

---

## Quick Reference

**If emails aren't working:**
1. Check console: F12 → Console tab
2. Look for errors mentioning "EmailJS"
3. Check `/api/config` endpoint is returning credentials
4. Verify template variable names match (case-sensitive!)
5. Check spam folder in email
6. Verify `to_email` parameter is sent
7. Restart server: `npm run dev`

**If you see this, you're good:**
```
✅ Configuration loaded: { EMAILJS_CONFIG: {...}, ... }
✅ EmailJS initialized successfully
✅ EmailJS admin send success: {...}
✅ EmailJS customer send success: {...}
```

---

## Support Resources

- EmailJS Docs: https://www.emailjs.com/docs/
- Template Editor Guide: https://www.emailjs.com/docs/templates/
- API Reference: https://www.emailjs.com/docs/api/send/
- Contact Support: https://www.emailjs.com/help/

---

**Setup Complete!** 🎉 Your AlfMart site now sends email notifications.
