## 4. Operational Guardrails
- **Inventory Logic:** Svaki proizvod mora imati `stock_quantity`. UI mora elegantno hendlovati "Out of Stock" stanja.
- **Server-Side Price Validation:** Checkout API uvek ponovo povlači cene iz baze. Nikada ne veruj ceni poslatoj sa klijenta.
- **Stripe Webhook Raw Body:** Koristiti `request.text()` za verifikaciju potpisa (ne `request.json()`).
- **Webhook Idempotency:** Obavezna provera `stripe_session_id` u bazi pre kreiranja narudžbine.

## 5. User Authentication (Zero-Dependency Auth)
- **Admin Access:** ENV-based lozinka (`ADMIN_PASSWORD_HASH`) + Secure httpOnly kuki.
- **User Login:** Registracija: Hash-ovanje lozinke preko `bcryptjs` pre `INSERT` operacije. Autentifikacija: Provera hasha i postavljanje `bb_user_session` httpOnly kukija.
    - **Storage:** Random token se čuva u `users.session_token` koloni u bazi. Provera se vrši u `getUserFromSession()` (`src/lib/userAuth.ts`).
- **Session Security:** `proxy.ts` štiti isključivo `/admin/*` rute. Korisničke stranice (npr. `/account`) proveru vrše direktno u layout/page komponenti putem `getUserFromSession()`.

## 6. Stripe Payment Integration (v22)
- **Flow:** Koristiti **Stripe Embedded Checkout** unutar modala.
- **Configuration:** `uiMode` mora biti postavljen na `'embedded_page' as const`.
- **Atomic Stock Update:** Smanjenje `stock_quantity` se vrši isključivo unutar Stripe Webhook-a nakon potvrđene uplate (`checkout.session.completed`).
- **Error Handling:** Ako se uplata potvrdi, a smanjenje zaliha ne uspe, sistem mora logovati grešku za manuelnu intervenciju (Inventory Integrity).

## 7. Known Gotchas & Versioning
- **Next.js 16:** Middleware fajl je `proxy.ts`, eksportuje `proxy()`.
- **Stripe SDK v22:** Koristiti `'embedded_page' as const` umesto `'embedded'`.
- **Zustand v5 + SSR:** Koristiti `skipHydration: true` i `partialize`.
- **Dynamic Rendering:** Dodati `export const dynamic = 'force-dynamic'` na stranice sa DB upitima u build-time-u.

## 8. Documentation & Logging
- **Claude Log:** Svaka arhitektonska promena mora biti zabeležena u `docs/CLAUDE_LOG.md`.
- **Environment Awareness:** Uvek poštovati putanju: `/home/nikibajaopak/web/kafa.nikolafilic.com/public_html`.
- **Brand Name:** Aplikacija se u celom UI-u naziva **"B & B"**.