## 4. Operational Guardrails
- **Inventory Logic:** Every product must have a `stock_quantity`. The UI must handle "Out of Stock" states gracefully.
- **Server-Side Price Validation:** The checkout API always re-fetches prices from the database. Never trust prices sent from the client.
- **Stripe Webhook Raw Body:** Use `request.text()` for signature verification (not `request.json()`).
- **Webhook Idempotency:** Always check `stripe_session_id` in the database before creating an order.

## 5. User Authentication (Zero-Dependency Auth)
- **Admin Access:** ENV-based password (`ADMIN_PASSWORD_HASH`) + secure httpOnly cookie.
- **User Login:** Registration: hash the password via `bcryptjs` before the `INSERT`. Authentication: verify hash and set `bb_user_session` httpOnly cookie.
    - **Storage:** Random token is stored in the `users.session_token` column in the database. Verified in `getUserFromSession()` (`src/lib/userAuth.ts`).
- **Session Security:** `proxy.ts` exclusively protects `/admin/*` routes. User pages (e.g., `/account`) perform the check directly in the layout/page component via `getUserFromSession()`.

## 6. Stripe Payment Integration (v22)
- **Flow:** Use **Stripe Embedded Checkout** inside a modal.
- **Configuration:** `uiMode` must be set to `'embedded_page' as const`.
- **Atomic Stock Update:** `stock_quantity` decrement happens exclusively inside the Stripe Webhook after a confirmed payment (`checkout.session.completed`).
- **Error Handling:** If payment is confirmed but stock decrement fails, the system must log the error for manual intervention (Inventory Integrity).

## 7. Known Gotchas & Versioning
- **Next.js 16:** Middleware file is `proxy.ts`, exports `proxy()`.
- **Stripe SDK v22:** Use `'embedded_page' as const` instead of `'embedded'`.
- **Zustand v5 + SSR:** Use `skipHydration: true` and `partialize`.
- **Dynamic Rendering:** Add `export const dynamic = 'force-dynamic'` to pages with DB queries at build time.
- **Leaflet + webpack:** Delete `_getIconUrl` from `L.Icon.Default.prototype` and use `mergeOptions` with CDN icon URLs — webpack does not bundle Leaflet's default images.
- **`export const dynamic` vs `import dynamic`:** These share the same name — use Leaflet maps only in client components to avoid the conflict.

## 8. Documentation & Logging
- **Claude Log:** Every architectural change must be recorded in `docs/CLAUDE_LOG.md`.
- **Environment Awareness:** Always respect the path: `/home/nikibajaopak/web/kafa.nikolafilic.com/public_html`.
- **Brand Name:** The application is called **"B & B"** everywhere in the UI.
