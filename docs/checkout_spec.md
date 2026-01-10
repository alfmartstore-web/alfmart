AlfMart — Cart & Checkout Specification (MVP)

Purpose
- Provide a minimal, secure checkout flow that captures orders, validates customer data, and triggers EmailJS notifications from the browser.
- Preserve current UI/UX; implement behavior with JS and small server endpoint `/api/orders` for persistence.

Flow (User)
1. Add to Cart: user selects product, color, and quantity; item added to cart (localStorage persistence).
2. View Cart: overlay shows items, editable quantities, remove item, subtotal, shipping placeholder.
3. Checkout: user clicks "Checkout" -> open checkout form overlay.
4. Checkout Form: collect Name, Email, Phone, Address, City, Optional Notes; choose Payment Method (COD or Bank Transfer).
5. Submit: client validates fields, posts order to `/api/orders`; on success show order number and send emails.
6. Confirmation: show success screen with order number and WA link for bank proof if payment=bank.

Minimal Fields (required)
- customer.name: string (min 2 chars)
- customer.email: valid email
- customer.phone: string (min 7 digits)
- customer.address: string (min 5 chars)
- customer.city: string
- cart.items: [{ product_id, name, sku?, selectedColor, qty, price }]
- payment_method: enum('cod','bank')

Validation Rules (client)
- Non-empty required fields
- Email regex check
- Phone digits-only check (or minimal length)
- Cart must contain at least one item

API: POST /api/orders (MVP)
- Request: JSON { customerDetails, cart, paymentMethod }
- Server behavior: validate payload, assign order_number (e.g., AM-YYYYMMDD-XXXX), persist to `data/orders.json` append, return { success: true, orderId }
- Security: no secrets in body; rate-limit if possible (basic server-side check)

Email Flow (client)
- After successful POST, client calls `sendEmails()` (already implemented) to:
  - Send admin email (templateAdmin)
  - Send customer email (templateCustomer)
- Note: EmailJS blocks non-browser REST; keep emails client-driven.

Persistence
- Simple JSON append at `data/orders.json` for MVP, with structure: { id, order_number, customer, items, total_cents, payment_method, status, created_at }
- Optional: integrate Supabase or a DB in a later phase.

Acceptance Criteria
- Users can add items to cart and reach checkout form.
- Validation prevents incomplete submissions.
- POST to `/api/orders` returns success and an order identifier.
- Client triggers EmailJS sends; admin and customer receive notifications.
- Order saved in `data/orders.json` (appended) and viewable via a private endpoint (later).

Next Steps
- Implement `/api/orders` POST handler in `server.js` to append to `data/orders.json` and return an order id.
- Add client-side calls already present to use that endpoint (already implemented in `index.html`).

Notes
- Keep payment processing out of scope for MVP — accept COD and bank transfer instructions.
- Ensure `data/orders.json` is gitignored for production sensitive data; for now store locally and treat as seed/dev-only.

Created: 2026-01-10
