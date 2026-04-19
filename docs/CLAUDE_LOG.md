# Claude AI Decision Log

## 2026-04-20 — UX Redesign: The Plantation Background

**Changes made:**
- `globals.css`: CSS variables updated to spec palette (`#FDF8F3` bg, `#2C1810` text). Added `.plantation-bg` class — full-screen `position: fixed; z-index: -1` background with `coffee-plant.jpg` covered by a warm cream gradient (`rgba(253,248,243,0.72→0.97)`). `background-attachment: scroll` on mobile to prevent iOS jank.
- `layout.tsx`: Added `<div className="plantation-bg">` as first child of `<body>`. Removed solid `bg-[#FAF8F6]` from body so the plantation shows through. Admin layout's own `min-h-screen bg-[#FDF8F3]` naturally covers it on admin pages.
- `page.tsx`: Product cards → `bg-white/80 backdrop-blur-sm rounded-xl` (glassmorphism, float above plantation). Added `hover:scale-[1.02] hover:shadow-xl transition-all`. Scarcity Logic added: "Only N left" warning when `stock_quantity <= 5`.
- `Header.tsx`: `bg-[#FDF8F3]/75 backdrop-blur-md` — semi-transparent, plantation shows through.
- `login`, `register`, `success`, `cancel` pages: Removed solid `min-h-screen bg-` backgrounds. Form/content wrapped in `bg-white/80 backdrop-blur-sm rounded-xl shadow-lg` card.
- `account/page.tsx`: Order cards → `bg-white/80 backdrop-blur-sm rounded-xl`.
- `AddToCartButton.tsx`: Added `hover:scale-105` tactile feedback.
- All files: `#FAF8F6` → `#FDF8F3`, `#1A120B` → `#2C1810` across all components and admin pages.
- **Required action:** Add `public/coffee-plant.jpg` — a high-res photo of a coffee plant with ripe red cherries (royalty-free from Unsplash/Pexels or own photography).

## 2026-04-20 — Translation to English

**Changes made:**
- Translated all `.md` files and `start.sh` to English
- `docs/MASTER_INSTRUCTIONS.md` sections 4–8 translated
- `docs/DEPLOYMENT.md` fully translated
- `docs/DATABASE.md` fully translated (all column descriptions)
- `docs/ARCHITECTURE.md` fully translated
- `docs/PRODUCT_CONCEPT.md` Phase 4 translated; Phase 5 (Analytics) added
- `docs/CLAUDE_LOG.md` all entries translated
- `docs/UX_DESIGN.md` Serbian phrases translated
- `start.sh` comments and echo messages translated

## 2026-04-19 — Phase 5: Analytics & BMAD Compliance

**Changes made:**
- `events` table added via migration `005_events.sql` with index on `(name, created_at)`
- Server-side tracker `src/lib/track.ts` — inserts event rows silently (never blocks requests)
- Client-side tracker `src/lib/trackClient.ts` — calls `/api/events` via POST
- `/api/events` route with event name whitelist (prevents abuse)
- Tracking added across the funnel: `add_to_cart` (cartStore), `checkout_started` (checkout API), `order_completed` (webhook)
- AI Sommelier tracking: `sommelier_opened`, `sommelier_recommendation_shown`, `sommelier_recommendation_added`
- `/admin/analytics` page: revenue KPIs (30d vs prev 30d), conversion funnel bars, top 5 coffees, AI sommelier stats, delivery breakdown
- `start.sh` improvements: `npm ci` (deterministic), `pm2 reload` (zero-downtime), rollback on build failure, post-deploy health check via `/api/health`
- `/api/health` route: `SELECT 1` DB ping, returns `{status, db, timestamp}`

## 2026-04-19 — Admin Orders Page

**Changes made:**
- New `/admin/orders` page — all orders sorted chronologically (newest first)
- Displays: order ID, status badge (paid/pending), delivery type (Pickup/Delivery), customer (name + email), date, total amount
- Order items: coffee name, quantity, price per item
- Destination: for home delivery shows address + coordinates if available, for pickup shows location name and address
- SQL query uses `JSON_AGG` + `JSON_BUILD_OBJECT` to aggregate items in a single query
- "Orders" link added to admin navigation (between Products and Locations)

## 2026-04-19 — Phase 4: Delivery & UX Optimization

**Changes made:**
- CartDrawer added "Delivery Options" step between cart view and payment (two tabs: Home Delivery / Pickup Point)
- Home Delivery: text address input + "Locate Me" (Browser Geolocation API + Nominatim reverse geocoding)
- Pickup Point: interactive Leaflet map with active locations, customer selects by clicking
- Maps: `react-leaflet` + OpenStreetMap tiles — open source, no API key
- Geocoding: Nominatim (`nominatim.openstreetmap.org/reverse`) — free, no key required
- Migration `003_delivery_address.sql`: `delivery_address`, `delivery_lat`, `delivery_lng` on `orders`
- Migration `004_pickup_locations.sql`: `pickup_locations` table + `delivery_type`, `pickup_location_id` on `orders`
- Admin `/admin/locations`: CRUD pickup locations with Leaflet map (click to pin, form for name/address, toggle, delete)
- Admin navigation extended with "Locations" link
- `/api/pickup-locations` GET route for fetching active locations
- Checkout API accepts `delivery` object (address, coordinates, pickup_location_id) and passes it through Stripe metadata
- Webhook saves delivery data and `pickup_location_id` with the order
- Leaflet marker icon fix: delete `_getIconUrl` + `mergeOptions` with CDN URLs (webpack does not bundle Leaflet images)
- Gotcha: `export const dynamic` and `import dynamic from 'next/dynamic'` share the same name — use in separate files

## 2026-04-19 — Phase 3: AI Sommelier

**Changes made:**
- Installed `@anthropic-ai/sdk`, Claude Haiku 4.5 model
- `/api/sommelier` POST route: loads active coffees from DB, sends catalog as system prompt, parses JSON recommendation from response
- `SommelierChat` floating widget (bottom-right): conversational UI, "Add to cart" button when Claude recommends a coffee
- API returns full `CartItem` object in recommendation (id, name, origin, price, image_url) — directly compatible with `addItem`
- `ANTHROPIC_API_KEY` added to `.env.local`

## 2026-04-19 — Phase 2: Operations & Commerce

**Changes made:**
- Zustand v5 cart store with `persist`, `skipHydration: true` and `partialize` — prevents SSR hydration mismatch
- `CartDrawer` + `CartProvider` + `Header` with cart icon and badge
- Admin Dashboard: CRUD for coffees, stock management, `is_active` toggle
- `proxy.ts` (Next.js 16 breaking change — `middleware.ts` → `proxy.ts`, `export proxy()`) — protects `/admin/*`
- Admin auth: `bcryptjs` hash in `.env.local`, `bb_admin_session` httpOnly cookie
- Gotcha: `$` in `.env.local` must be escaped as `\$` — Next.js auto-expands `$VAR`
- Migration `001_add_stock.sql`: added `stock_quantity` and `is_active` columns on `coffees`
- Migration `002_users_orders.sql`: created `users`, `orders`, `order_items` tables
- User auth: registration/login via `bcryptjs`, `bb_user_session` httpOnly cookie, token in `users.session_token`
- Stripe Embedded Checkout: `ui_mode: 'embedded_page' as const` (Stripe SDK v22 — `'embedded'` is no longer valid)
- `EmbeddedCheckoutProvider` + `EmbeddedCheckout` in `CheckoutModal` instead of a redirect
- Webhook (`/api/webhook`): `request.text()` for signature verification, idempotency check on `stripe_session_id`, stock decrement with `GREATEST(0, stock_quantity - qty)`
- Server-side price validation in checkout API — client-side prices are ignored
- Order history page at `/account`
- Rebrand UI: "Bean & Brew" → "B & B" across all UI locations

## 2026-04-19 — Phase 1 Bug Fixes

**Changes made:**
- `Coffee.notes` and `Coffee.image_url` typed as `string | null` to reflect real DB nullable state
- `coffee.notes?.split(',')` — optional chaining prevents crash on NULL DB value
- Image fallback replaced: removed reference to non-existent `/placeholder-coffee.jpg`; now renders a CSS placeholder div when `image_url` is null
- "Add to Cart" button set to `disabled` — Phase 1 has no cart; button will be enabled in Phase 2
- Removed `bcrypt` and `@types/bcrypt` from `package.json` — not used in Phase 1, violates lean architecture constraint
