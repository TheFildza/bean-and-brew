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

### Phase 4: Delivery & UX Optimization (CURRENT)
* **Hybrid Fulfillment:** Kupac bira između "Dostave na adresu" i "Ličnog preuzimanja" (Click & Collect) tokom checkout procesa.
* **Address Capture:** Tekstualni unos adrese + opcioni "Lociraj me" (Browser Geolocation API) za auto-popunjavanje na mobilnim uređajima. Adresa i koordinate se čuvaju uz narudžbinu. Nema integracije sa kurirskom službom u ovoj fazi — adresa služi kao podatak za manuelnu obradu.
* **Click & Collect Lokacije:** Fiksne lokacije (pijace, kafići) kojima upravlja admin putem interaktivne mape (centrirana na Beograd). Lokacije se čuvaju u bazi sa nazivom, adresom i koordinatama. Kupac bira lokaciju sa mape tokom checkout-a.

## 5. Technical Stack (Architect's Note)
| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 | Leading-edge performance, SEO, and Server Actions. |
| **Database** | Neon (Postgres) | Serverless scalability with instant branching and low latency. |
| **ORM** | Prisma | Type-safe database access and streamlined migrations. |
| **State** | Zustand | Lightweight, persistent client-side state management. |
| **Infrastructure**| HestiaCP / Nginx | High-control VPS management with custom reverse-proxy optimization. |