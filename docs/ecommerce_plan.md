AlfMart — E‑commerce Transformation Plan (High Level)

Objective
- Convert the current content-first website into a minimal viable e-commerce storefront that can accept orders, manage basic inventory, and send transactional emails — while preserving the existing UI/UX and focusing only on content and data structure changes in this phase.

Phases & Milestones

1) Plan & Data Model (this doc)
- Deliverables: Product schema, order schema, minimal API endpoints spec, list of integrations.
- Acceptance: JSON schema files and example seed data committed to `data/` and `docs/`.

2) Product Model + Seed
- Deliverables: `data/products.json` (seed), `docs/product_schema.md` (schema & examples).
- Acceptance: Homepage product cards populate from the seed file; product detail page placeholder created.

3) Product Detail & Cart UI (content-only changes)
- Deliverables: product detail template (HTML content driven), cart JS that stores cart in localStorage, order summary overlay.
- Acceptance: Users can add items, view cart, and reach a checkout form (no payment yet).

4) Checkout & Orders (MVP)
- Deliverables: checkout form (customer details), order POST to `/api/orders`, EmailJS notifications (admin + customer), order persistence (lightweight JSON storage / supabase stub).
- Acceptance: Orders are recorded and emails sent from browser; admin receives order email; `/api/orders` returns recent orders.

5) Payments & Shipping (integration)
- Deliverables: Payment provider selection (Stripe/Payfast/local), payment gateway integration or hosted checkout, shipping rules & rates.
- Acceptance: Successful paid orders recorded and confirmed by email.

6) Admin, Inventory, and Ops
- Deliverables: Minimal admin UI (view orders, change status), inventory counters, export orders CSV.
- Acceptance: Admin can mark shipped/fulfilled; inventory decrements on order placement.

Scope & Constraints
- No structural UI/CSS changes unless essential for data binding.
- EmailJS remains browser-first; server REST calls to EmailJS are blocked (403). Use client sends or a server mail provider for server-side sends.
- Keep third-party integrations optional until Phase 4+.

Data Models (summary)
- Product: id, sku, title, description, price_cents, currency, images[], variants[], tags[], materials, inventory_count, slug, featured
- Order: id, order_number, items[{product_id, sku, qty, price_cents}], total_cents, customer{name,email,phone,address}, payment_method, status, created_at

Timeline (suggested)
- Week 1: Plan, product schema, seed data, and homepage binding.
- Week 2: Product detail + cart persistence + checkout form (orders to `/api/orders`).
- Week 3: Email flows, order persistence, admin interface MVP.
- Week 4+: Payments integration and shipping rules.

Immediate next steps (for me)
- Commit `docs/product_schema.md` and a small `data/products.json` seed (3 products), then wire homepage to load from `data/products.json`.
- Implement `/api/orders` to accept POST and persist to simple JSON file or supabase (if configured).

Risks & Notes
- EmailJS blocks non-browser REST calls; keep notifications client-driven or use a server-side mail provider.
- Storing secrets: keep payment keys out of the repo and use environment variables (`.env` / `wrangler.toml`).

Created: 2026-01-10
Author: AlfMart product & dev
