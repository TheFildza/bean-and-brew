# Architecture Decision Records (ADR)

## Tech Stack
- **Framework:** Next.js 15 (App Router). Selected for its React Server Components (RSC) which provide zero-bundle-size fetching.
- **Styling:** Tailwind CSS. Enables rapid, consistent UI development based on the `UX_DESIGN.md` tokens.
- **Database:** Neon (PostgreSQL). Serverless architecture for high availability and low maintenance.
- **AI Engine:** Claude API (Planned). Will be integrated via Server Actions to ensure API keys are never exposed to the client.

## Key Principles
1. **Server-First:** All data fetching is done in Server Components to maximize performance and SEO.
2. **Minimalist Dependencies:** Keeping the `package.json` lean to reduce security surface and build times.
3. **Type Safety:** TypeScript is used across the entire stack to ensure data integrity from DB to UI.

## Deployment Strategy
- Local development on Windows with Turbopack.
- Production target: Ubuntu/HestiaCP or Vercel (Edge runtime).