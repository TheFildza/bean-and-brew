# B & B: Product Concept & Roadmap

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

> **Note on Measure & Act:** In the current MVP stages, "Measure" is implicit — each phase is validated through manual testing and live usage on `kafa.nikolafilic.com`. Formal analytics (conversion tracking, funnel analysis) are planned for a future iteration once baseline traffic exists.

### Phase 1: The Digital Shelf (COMPLETED)
* **High-Performance Infrastructure:** Next.js 16 (App Router), Neon PostgreSQL (Serverless), and Tailwind CSS v4.
* **Boutique Catalog:** A curated display of specialty roasts with structured data (origin, roast level, flavor notes).
* **Architectural Stability:** PM2/GitHub Actions push-to-deploy pipeline on Ubuntu/HestiaCP VPS.

### Phase 2: Operations & Commerce (COMPLETED)
* **Persistent Cart Logic:** Implementation of a session-persistent shopping cart using **Zustand**, ensuring a seamless UX across browser refreshes.
* **Admin Dashboard:** A secure, no-code-required interface for founders to manage inventory (CRUD), stock levels, and pricing.
* **Inventory Integrity:** Real-time stock tracking with "Out of Stock" logic to manage customer expectations.

### Phase 3: AI Sommelier (COMPLETED)
* **Conversational Commerce:** Integrating a custom-tuned LLM (Claude/DeepSeek) to act as a virtual barista/sommelier.
* **Intelligent Recommendations:** Guiding non-expert customers based on taste profiles (e.g., "nutty vs. floral") and pairing suggestions.
* **Direct Cart Integration:** Empowering the AI agent to push recommended products directly to the user's cart.

### Phase 4: Delivery & UX Optimization (CURRENT)
* **Hybrid Fulfillment:** Kupac bira između "Dostave na adresu" i "Ličnog preuzimanja" (Click & Collect) tokom checkout procesa.
* **Address Capture:** Tekstualni unos adrese + opcioni "Lociraj me" (Browser Geolocation API) za auto-popunjavanje na mobilnim uređajima. Adresa i koordinate se čuvaju uz narudžbinu. Nema integracije sa kurirskom službom u ovoj fazi — adresa služi kao podatak za manuelnu obradu.
* **Click & Collect Lokacije:** Fiksne lokacije (pijace, kafići) kojima upravlja admin putem interaktivne mape (centrirana na Beograd). Lokacije se čuvaju u bazi sa nazivom, adresom i koordinatama. Kupac bira lokaciju sa mape tokom checkout-a.

## 4. MVP Core Requirements
* **Performance:** Sub-1s page loads using SSR and optimized image delivery.
* **Operational Simplicity:** A robust Admin Dashboard for non-technical founders.
* **Scalability:** Raw SQL schema (no ORM) designed for low build times and flexible future expansion.
* **Reliability:** Automated "Audit Trail" via `CLAUDE_LOG.md` and safe deployment rollback procedures.

## 5. Technical Stack (Architect's Note)
| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 | App Router, Server Actions, `proxy.ts` middleware convention. |
| **Database** | Neon (Postgres) | Serverless scalability with instant branching and low latency. |
| **Data Access** | Raw SQL (`@neondatabase/serverless`) | No ORM — keeps build times low, full query control. |
| **Payments** | Stripe Embedded Checkout | In-page modal, no redirect. SDK v22, `ui_mode: 'embedded_page'`. |
| **AI** | Claude Haiku 4.5 (Anthropic) | Conversational sommelier with direct cart integration. |
| **State** | Zustand v5 | Lightweight, SSR-safe persistent cart (`skipHydration`). |
| **Infrastructure** | HestiaCP / PM2 / GitHub Actions | Push-to-`prod` auto-deploy via SSH. |