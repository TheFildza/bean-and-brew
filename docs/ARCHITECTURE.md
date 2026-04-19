# Architecture Decision Records (ADR)

## Tech Stack
- **Framework:** Next.js 16 (App Router). Server Components for zero-bundle-size fetching. `proxy.ts` instead of `middleware.ts` (breaking change in v16).
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`, `@theme inline` — no config file).
- **Database:** Neon (PostgreSQL). Serverless architecture, raw SQL via `@neondatabase/serverless`. No ORM.
- **Payments:** Stripe Embedded Checkout (SDK v22). `ui_mode: 'embedded_page'`, in-page modal with no redirect.
- **AI Engine:** Claude Haiku 4.5 (Anthropic API). Integrated as a Server Route (`/api/sommelier`). API key never reaches the client.
- **State:** Zustand v5 with `persist` + `skipHydration: true` for SSR-safe cart.
- **Maps:** Leaflet + react-leaflet + OpenStreetMap tiles. Nominatim for geocoding. No API key required.
- **Auth:** bcryptjs hash + httpOnly cookies. Admin: ENV-based. Users: token stored in DB.

## Key Principles
1. **Server-First:** All DB queries are in Server Components or Route Handlers — never on the client.
2. **Minimalist Dependencies:** Lean `package.json` — no Prisma, no NextAuth, no heavy ORMs.
3. **Type Safety:** TypeScript throughout the entire stack.
4. **Security:** Server-side price validation in checkout API. Stripe webhook signature verification using `request.text()`.

## Route Structure
- `/` — coffee catalog (Server Component)
- `/login`, `/register` — user auth
- `/account` — order history (protected)
- `/admin` — products CRUD (protected via `proxy.ts`)
- `/admin/orders` — orders overview
- `/admin/locations` — pickup location CRUD with map
- `/admin/analytics` — KPI dashboard (revenue, funnel, AI sommelier stats)
- `/api/checkout` — creates Stripe Checkout session
- `/api/webhook` — Stripe webhook handler
- `/api/sommelier` — Claude AI chat endpoint
- `/api/pickup-locations` — list of active pickup locations
- `/api/events` — client-side analytics event receiver
- `/api/health` — health check (DB ping)

## Deployment Strategy
- Local development on Windows with Turbopack.
- Production: Ubuntu 24.04 / HestiaCP / PM2 on `kafa.nikolafilic.com`.
- CI/CD: GitHub Actions → SSH → `./start.sh` on push to `prod` branch.
