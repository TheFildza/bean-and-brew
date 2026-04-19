# Claude AI Decision Log

## 2026-04-19 — Dodat start.sh (PM2)

**Promjena:** Kreiran `start.sh` za pokretanje aplikacije na serveru putem PM2.

**Odluke:**
- `npm ci --omit=dev` umjesto `npm install` — reproducibilni build, bez dev zavisnosti na produkciji
- `pm2 restart ... --update-env` ako proces već postoji — idempotentna skripta, sigurna za ponovljene deploye
- `--skip-build` flag — omogućava restart bez ponovnog builda (korisno za konfiguracionne promjene)
- Logovi u `logs/` direktorijumu sa `--time` flagom za timestamps
- `pm2 save` na kraju — proces preživljava server reboot (u kombinaciji sa `pm2 startup`)


## 2026-04-19 — Admin Orders Page

**Changes made:**
- Nova stranica `/admin/orders` — lista svih narudžbina sortirana hronološki (najnovije prvo)
- Prikazuje: order ID, status badge (paid/pending), tip dostave (Pickup/Delivery), kupac (ime + email), datum, ukupan iznos
- Stavke narudžbine: naziv kafe, količina, cena po stavci
- Footer kartice: adresa dostave ili naziv pickup lokacije
- SQL query koristi `JSON_AGG` + `JSON_BUILD_OBJECT` za agregaciju stavki u jednom upitu
- Link "Orders" dodat u admin navigaciju (između Products i Locations)

## 2026-04-19 — Phase 4: Delivery & UX Optimization

**Changes made:**
- CartDrawer dodat korak "Delivery Options" između korpe i plaćanja (dva taba: Home Delivery / Pickup Point)
- Home Delivery: tekstualni unos adrese + "Lociraj me" (Browser Geolocation API + Nominatim reverse geocoding)
- Pickup Point: interaktivna Leaflet mapa sa aktivnim lokacijama, kupac bira klikanjem
- Mapa: `react-leaflet` + OpenStreetMap tiles — open source, bez API ključa
- Geocoding: Nominatim (`nominatim.openstreetmap.org/reverse`) — besplatno, bez ključa
- Migracija `003_delivery_address.sql`: `delivery_address`, `delivery_lat`, `delivery_lng` na `orders`
- Migracija `004_pickup_locations.sql`: `pickup_locations` tabela + `delivery_type`, `pickup_location_id` na `orders`
- Admin `/admin/locations`: CRUD pickup lokacija sa Leaflet mapom (klik za pin, form za naziv/adresu, toggle, delete)
- Admin navigacija proširena linkom "Locations"
- `/api/pickup-locations` GET ruta za dohvatanje aktivnih lokacija
- Checkout API prihvata `delivery` objekat (adresa, koordinate, pickup_location_id) i prosleđuje kroz Stripe metadata
- Webhook čuva delivery podatke i `pickup_location_id` uz narudžbinu
- Leaflet marker icon fix: brisanje `_getIconUrl` + `mergeOptions` sa CDN URL-ovima (webpack ne bundluje Leaflet slike)
- Gotcha: `export const dynamic` i `import dynamic from 'next/dynamic'` imaju isti naziv — koristiti u odvojenim fajlovima

## 2026-04-19 — Phase 3: AI Sommelier

**Changes made:**
- Instaliran `@anthropic-ai/sdk`, Claude Haiku 4.5 model
- `/api/sommelier` POST ruta: učitava aktivne kafe iz DB, šalje katalog kao system prompt, parsira JSON preporuku iz odgovora
- `SommelierChat` floating widget (bottom-right): konverzacijski UI, "Add to cart" dugme kad Claude preporuči kafu
- API vraća pun `CartItem` objekat u preporuci (id, name, origin, price, image_url) — direktno kompatibilno sa `addItem`
- `ANTHROPIC_API_KEY` dodat u `.env.local`

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
