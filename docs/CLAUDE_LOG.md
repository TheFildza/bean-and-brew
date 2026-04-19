# Claude AI Decision Log

## 2026-04-19 — Dodat start.sh (PM2)

**Promjena:** Kreiran `start.sh` za pokretanje aplikacije na serveru putem PM2.

**Odluke:**
- `npm ci --omit=dev` umjesto `npm install` — reproducibilni build, bez dev zavisnosti na produkciji
- `pm2 restart ... --update-env` ako proces već postoji — idempotentna skripta, sigurna za ponovljene deploye
- `--skip-build` flag — omogućava restart bez ponovnog builda (korisno za konfiguracionne promjene)
- Logovi u `logs/` direktorijumu sa `--time` flagom za timestamps
- `pm2 save` na kraju — proces preživljava server reboot (u kombinaciji sa `pm2 startup`)


## 2026-04-19 — Phase 2: Operations & Commerce

**Changes made:**
- Zustand v5 cart store sa `persist`, `skipHydration: true` i `partialize` — sprečava SSR hydration mismatch
- `CartDrawer` + `CartProvider` + `Header` sa cart ikonom i badge-om
- Admin Dashboard: CRUD za kafe, stock management, `is_active` toggle
- `proxy.ts` (Next.js 16 breaking change — `middleware.ts` → `proxy.ts`, `export proxy()`) — štiti `/admin/*`
- Admin auth: `bcryptjs` hash u `.env.local`, `bb_admin_session` httpOnly cookie
- Gotcha: `$` u `.env.local` mora biti escapovan kao `\$` — Next.js auto-expanduje `$VAR`
- Migracija `001_add_stock.sql`: dodate `stock_quantity` i `is_active` kolone na `coffees`
- Migracija `002_users_orders.sql`: kreirane `users`, `orders`, `order_items` tabele
- User auth: registracija/login putem `bcryptjs`, `bb_user_session` httpOnly cookie, token u `users.session_token`
- Stripe Embedded Checkout: `ui_mode: 'embedded_page' as const` (Stripe SDK v22 — `'embedded'` više nije validan)
- `EmbeddedCheckoutProvider` + `EmbeddedCheckout` u `CheckoutModal` modalu umesto redirect-a
- Webhook (`/api/webhook`): `request.text()` za signature verifikaciju, idempotency check na `stripe_session_id`, stock decrement sa `GREATEST(0, stock_quantity - qty)`
- Server-side price validation u checkout API-ju — klijentske cene se ignorišu
- Order history stranica na `/account`
- Rebrand UI: "Bean & Brew" → "B & B" na svim UI mestima

## 2026-04-19 — Phase 1 Bug Fixes

**Changes made:**
- `Coffee.notes` and `Coffee.image_url` typed as `string | null` to reflect real DB nullable state
- `coffee.notes?.split(',')` — optional chaining prevents crash on NULL DB value
- Image fallback replaced: removed reference to non-existent `/placeholder-coffee.jpg`; now renders a CSS placeholder div when `image_url` is null
- "Add to Cart" button set to `disabled` — Phase 1 has no cart; button will be enabled in Phase 2
- Removed `bcrypt` and `@types/bcrypt` from `package.json` — not used in Phase 1, violates lean architecture constraint
