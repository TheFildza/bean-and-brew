# Bean & Brew: Product Concept & Roadmap

## 1. Business Context & Objective
The client is transitioning from local farmers' markets and wholesale to a **Direct-to-Consumer (D2C)** online model. 
**Primary Objective:** Digitalize the artisanal brand experience while maintaining simplicity and authenticity for non-technical founders. The platform must transform a physical roastery into a scalable digital entity.

## 2. Product Vision
The digital storefront acts as a **"Virtual Shelf"** that reflects the physical roastery's quality. We focus on:
* **Visual Clarity:** High-quality imagery, premium typography, and minimalist aesthetics.
* **Storytelling:** Connecting the customer with the origin, farm, and artisanal roasting process.
* **Frictionless Conversion:** A streamlined path from discovery to final purchase.

## 3. Road-to-Market (BMAD Strategy)
We follow the **Build-Measure-Act-Deploy** framework to ensure rapid, stable, and validated iterations.

### Phase 1: The Digital Shelf (COMPLETED)
* **High-Performance Infrastructure:** Next.js 15 (App Router), Neon PostgreSQL (Serverless), and Tailwind CSS.
* **Boutique Catalog:** A curated display of specialty roasts with structured data (origin, roast level, flavor notes).
* **Architectural Stability:** Custom Nginx/PM2 deployment scripts for optimized performance on Ubuntu/HestiaCP environments.

### Phase 2: Operations & Commerce (CURRENT)
* **Persistent Cart Logic:** Implementation of a session-persistent shopping cart using **Zustand**, ensuring a seamless UX across browser refreshes.
* **Admin Dashboard:** A secure, no-code-required interface for founders to manage inventory (CRUD), stock levels, and pricing.
* **Inventory Integrity:** Real-time stock tracking with "Out of Stock" logic to manage customer expectations.

### Phase 3: AI Sommelier (PLANNED)
* **Conversational Commerce:** Integrating a custom-tuned LLM (Claude/DeepSeek) to act as a virtual barista/sommelier.
* **Intelligent Recommendations:** Guiding non-expert customers based on taste profiles (e.g., "nutty vs. floral") and pairing suggestions.
* **Direct Cart Integration:** Empowering the AI agent to push recommended products directly to the user's cart.

### Phase 4: Scaling & Retention (FUTURE)
* **Subscription Model:** "Subscribe & Save" logic for recurring monthly revenue.
* **QR Traceability:** Linking physical packaging to digital batch stories and roast dates.

## 4. MVP Core Requirements
* **Performance:** Sub-1s page loads using SSR and optimized image delivery.
* **Operational Simplicity:** A robust Admin Dashboard for non-technical founders.
* **Scalability:** A flexible Prisma-based schema designed for multi-region inventory and future expansion.
* **Reliability:** Automated "Audit Trail" via `CLAUDE_LOG.md` and safe deployment rollback procedures.

## 5. Technical Stack (Architect's Note)
| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 | Leading-edge performance, SEO, and Server Actions. |
| **Database** | Neon (Postgres) | Serverless scalability with instant branching and low latency. |
| **ORM** | Prisma | Type-safe database access and streamlined migrations. |
| **State** | Zustand | Lightweight, persistent client-side state management. |
| **Infrastructure**| HestiaCP / Nginx | High-control VPS management with custom reverse-proxy optimization. |