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

### Phase 1: The Digital Shelf (COMPLETED)
* **High-Performance Infrastructure:** Next.js 16 (App Router), Neon PostgreSQL (Serverless), and Tailwind CSS v4.
* **Boutique Catalog:** A curated display of specialty roasts with structured data (origin, roast level, flavor notes).
* **Architectural Stability:** PM2/GitHub Actions push-to-deploy pipeline on Ubuntu/HestiaCP VPS.

### Phase 2: Operations & Commerce (COMPLETED)
* **Persistent Cart Logic:** Implementation of a session-persistent shopping cart using **Zustand**, ensuring a seamless UX across browser refreshes.
* **Admin Dashboard:** A secure, no-code-required interface for founders to manage inventory (CRUD), stock levels, and pricing.
* **Inventory Integrity:** Real-time stock tracking with "Out of Stock" logic to manage customer expectations.

### Phase 3: AI Sommelier (COMPLETED)
* **Conversational Commerce:** Integrating a custom-tuned LLM (Claude Haiku 4.5) to act as a virtual barista/sommelier.
* **Intelligent Recommendations:** Guiding non-expert customers based on taste profiles (e.g., "nutty vs. floral") and pairing suggestions.
* **Direct Cart Integration:** Empowering the AI agent to push recommended products directly to the user's cart.

### Phase 4: Delivery & UX Optimization (COMPLETED)
* **Hybrid Fulfillment:** The customer chooses between "Home Delivery" and "Click & Collect" during the checkout process.
* **Address Capture:** Text input for address + optional "Locate Me" (Browser Geolocation API) for auto-fill on mobile devices. Address and coordinates are stored with the order. No courier integration in this phase — the address is used as data for manual processing.
* **Click & Collect Locations:** Fixed locations (markets, cafés) managed by the admin via an interactive map (centered on Belgrade). Locations are stored in the database with name, address, and coordinates. The customer selects a location from the map during checkout. The admin map occupies the full screen width with a text search field above — search zooms the map to the given address, area, or term (Nominatim geocoding).
* **Admin Orders View:** The admin sees all orders with complete details — customer (name, email), items (coffee name, quantity, price), total amount, payment status, date, delivery type, and destination (home address with coordinates if available, or the name and address of the pickup location). Orders are sorted chronologically, newest first.

### Phase 5: Analytics & BMAD Compliance (COMPLETED)
* **Zero-Dependency Analytics:** Custom `events` table in Neon for tracking user behavior without third-party tools.
* **Conversion Funnel:** Tracks `add_to_cart` → `checkout_started` → `order_completed` events.
* **AI Sommelier Metrics:** Tracks `sommelier_opened`, `sommelier_recommendation_shown`, `sommelier_recommendation_added` to measure AI-driven conversion.
* **Admin Analytics Dashboard:** KPI cards (revenue 30d vs prev 30d, orders, avg order value, AI CVR), funnel bars, top 5 coffees by revenue, delivery type breakdown.
* **Deployment Reliability:** `npm ci` for deterministic installs, `pm2 reload` for zero-downtime restarts, rollback-on-build-failure, post-deploy health check.

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
