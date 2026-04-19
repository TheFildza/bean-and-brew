# B & B — Artisanal Coffee Roastery

D2C e-commerce platform for a specialty coffee roastery. Built following the BMAD methodology.

## Stack
- **Next.js 16** (App Router, Server Components, Server Actions)
- **Neon PostgreSQL** (raw SQL, no ORM)
- **Tailwind CSS v4**
- **Stripe Embedded Checkout** (SDK v22)
- **Claude Haiku 4.5** (AI Sommelier)
- **Zustand v5** (cart state)
- **Leaflet + OpenStreetMap** (pickup locations)

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy to `.env.local` (see `docs/DEPLOYMENT.md` for the full list):

```env
DATABASE_URL=...
ADMIN_PASSWORD_HASH=...
ADMIN_SESSION_TOKEN=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_BASE_URL=...
ANTHROPIC_API_KEY=...
```

## Deployment

Push to the `prod` branch to trigger an automatic deploy via GitHub Actions → SSH → PM2.

```bash
git checkout prod && git merge master && git push origin prod
```

Details: `docs/DEPLOYMENT.md`

## Documentation

| File | Contents |
| :--- | :--- |
| `docs/PRODUCT_CONCEPT.md` | Roadmap and business goals |
| `docs/ARCHITECTURE.md` | Architectural decisions |
| `docs/DATABASE.md` | Database schema and migrations |
| `docs/UX_DESIGN.md` | Design system and user experience |
| `docs/MASTER_INSTRUCTIONS.md` | Technical development guidelines |
| `docs/CLAUDE_LOG.md` | Log of all architectural changes |
| `docs/DEPLOYMENT.md` | Deployment and CI/CD guide |
