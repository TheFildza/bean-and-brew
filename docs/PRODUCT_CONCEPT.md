# Master Instructions: Bean & Brew (Senior Architect Guidelines)

## 1. Core Architecture Philosophy
- **Lean & High-Performance:** Prioritize minimal dependencies and fast execution.
- **BMAD Framework:** All features must follow Build, Measure, Act, Deploy cycles.
- **Production-First:** Security and stability are non-negotiable from the first line of code.

## 2. Technical Stack & Data Strategy
- **Framework:** Next.js 15 (App Router).
- **Database:** Neon PostgreSQL (Serverless).
- **Data Access:** Raw SQL via `@neondatabase/serverless`. **PROHIBITED:** Prisma or heavy ORMs (keep build times low).
- **State Management:** **Zustand** with `persist` middleware for the shopping cart.
- **Security:** Use **bcryptjs** for admin password hashing. Credentials must reside in `.env.local`.

## 3. Deployment & CI/CD Strategy (Push-to-Deploy)
- **Branching:** - `master`: Development and feature integration.
  - `prod`: The "Holy" branch. Push/Merge to `prod` triggers automatic deployment.
- **Pipeline:** GitHub Actions -> SSH -> VPS (`kafa.nikolafilic.com`).
- **Automation:** Every deploy must execute `./start.sh` which handles `git reset --hard`, `npm install`, `npm run build`, and `pm2 restart`.
- **Secrets:** All server credentials must be stored in GitHub Secrets (`SSH_PRIVATE_KEY`, `SERVER_IP`, etc.).

## 4. Operational Guardrails
- **Zero-Dependency Auth:** Use ENV-based password + Secure httpOnly Cookies for the Admin Dashboard. Avoid NextAuth for single-user scenarios.
- **Inventory Logic:** Every product must have a `stock_quantity`. UI must handle "Out of Stock" states gracefully.
- **Image Handling:** Use standard URL inputs for images in MVP Phase 2. Avoid complex S3 integrations until Phase 3.

## 5. Documentation & Logging
- **Claude Log:** Every architectural change or bug fix must be recorded in `docs/CLAUDE_LOG.md`.
- **Deployment Manual:** Refer to `docs/DEPLOYMENT.md` for server setup and CI/CD maintenance.
- **Product Vision:** Refer to `docs/PRODUCT_CONCEPT.md` for roadmap and business objectives.
- **Target OS:** Ubuntu 24.04 LTS (Noble Numbat).
- **Node.js:** Verifikovati da je instalirana LTS verzija (v20+) kompatibilna sa Ubuntu 24.04.
- **SSH Protocol:** Ubuntu 24.04 podrazumevano koristi strože SSH algoritme (preferirati ED25519 ključeve za CI/CD).

## 6. AI Interaction Rules
- **Self-Testing:** AI must simulate/test logic (Unit tests or Stress tests) before providing final code.
- **Environment Awareness:** Always respect the HestiaCP/PM2 environment path: `/home/nikibajaopak/web/kafa.nikolafilic.com/public_html`.