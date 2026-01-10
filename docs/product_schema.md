Product JSON Schema (draft)

Overview
- Keep product fields minimal and e-commerce-ready. Prices stored in cents (integers) to avoid float issues.

Example JSON Schema (informal)
{
  "id": "string (uuid)",
  "sku": "string",
  "title": "string",
  "slug": "string",
  "description": "string (html allowed)",
  "price_cents": "integer",
  "currency": "string (ISO 4217, e.g., PKR)",
  "images": ["string (relative or absolute url)"],
  "variants": [{"id":"string","title":"string","price_cents":"integer","sku":"string","inventory_count":"integer"}],
  "tags": ["string"],
  "materials": "string",
  "dimensions": {"width_mm":"integer","height_mm":"integer","depth_mm":"integer"},
  "inventory_count": "integer",
  "featured": false,
  "created_at": "ISO-8601 timestamp"
}

Example product
{
  "id": "wallet-001",
  "sku": "AM-WAL-001",
  "title": "Genuine Leather Bifold Wallet",
  "slug": "genuine-leather-bifold-wallet",
  "description": "A compact bifold in full-grain leather with six card slots and a stitched bill compartment.",
  "price_cents": 499500,
  "currency": "PKR",
  "images": ["/Genuine Leather Bifold Wallet/hero.jpg"],
  "variants": [],
  "tags": ["bifold","leather","wallet"],
  "materials": "Full-grain cowhide",
  "dimensions": {"width_mm": 110, "height_mm": 95, "depth_mm": 10},
  "inventory_count": 120,
  "featured": true,
  "created_at": "2026-01-10T00:00:00Z"
}

Next: if you approve, I'll add `data/products.json` with three seed products and wire the homepage to load them. Keep in mind you previously asked not to add products — I'll only add them as a non-destructive seed file kept out of production unless you approve.
