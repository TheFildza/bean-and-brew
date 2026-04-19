# UX Design Strategy: B & B

## 1. Visual Identity & Atmosphere
The design must evoke the sensory experience of a specialty coffee roastery: warmth, precision, and craftsmanship.

- **Background:** Soft Cream (`#FAF8F6`) - more organic than pure white.
- **Typography:** - **Headings:** Elegant Serif (e.g., Playfair Display) for a premium, heritage feel.
  - **Body:** Clean Sans-serif (e.g., Inter) for readability and modern SaaS vibe.
- **Primary Colors:** - Deep Espresso (`#1A120B`) for primary text.
  - Roasted Brown (`#3C2A21`) for accents and secondary elements.
  - Muted Gold or Amber (`#B68D40`) for special highlights (e.g., Top Rated).

## 2. Layout Principles
- **Generous White Space:** Avoiding clutter to let the products "breathe."
- **High-Quality Imagery:** Focus on macro shots of beans and the brewing process.
- **Micro-interactions:** Subtle transitions on card hovers to signal quality.

## 3. User Journey (Phase 1)
1. **Landing:** Hero section with a strong brand statement.
2. **Discovery:** A minimalist grid of coffees with clear roast indicators (visual dots).
3. **Detail:** Simple card structure showing:
   - Origin (as a prominent badge)
   - Flavor notes (as a list or tags)
   - Price & Roast Level

## 4. Mobile Experience
- Single-column layout for the product list.
- Large, "thumb-friendly" interaction areas.
- Fast, lazy-loaded images to maintain performance on cellular networks.

## 5. Cart & Checkout UX
- **Cart Drawer:** Slide-in panel s desne strane, overlay pozadina zatvara drawer na klik.
- **Item Controls:** Inline +/- dugmad za količinu, trash ikona za uklanjanje, thumbnail slike za vizuelni kontekst.
- **Checkout Modal:** Stripe Embedded Checkout se otvara u centrisanom modalu — korisnik ne napušta stranicu.
- **Empty State:** Prijatna poruka kad je korpa prazna, bez praznog UI-ja.
- **Error Feedback:** Inline greška ispod checkout dugmeta (out of stock, mrežna greška).
- **Auth Gate:** Ako korisnik nije ulogovan, redirect na `/login?next=checkout` pre otvaranja plaćanja.

## 6. Admin Dashboard UX
- **Odvojena vizuelna tema:** Tamni header (`#1A120B`) jasno signalizira admin kontekst — ne meša se sa korisničkim UI-jem.
- **Tabela proizvoda:** Kompaktna, density-first lista sa inline akcijama (Edit, Delete, toggle aktivnosti).
- **Forme:** Jednostavne, vertikalne forme sa jasnim label-ima. Greške inline ispod polja.
- **Stock indikator:** Vizuelno upozorenje kad je `stock_quantity` = 0 (badge "Out of Stock").
- **Destruktivne akcije:** Delete dugme traži potvrdu kako bi se sprečilo slučajno brisanje.
- **Locations mapa:** Full-width Leaflet mapa sa poljem za pretragu iznad. Pretraga zumira mapu na adresu/oblast/pojam (Nominatim geocoding). Klik na mapu dodaje pin, forma za naziv/adresu se pojavljuje ispod mape.

## 7. Auth Pages UX (Login / Register)
- **Minimalistički layout:** Centrisana kartica na Cream pozadini, bez navigacije.
- **Brand logo/naziv** na vrhu forme za konzistentnost.
- **Inline greške:** Prikazati specifičnu poruku (pogrešna lozinka, email već postoji).
- **Cross-links:** Login stranica ima link na Register i obrnuto.

## 8. Order History UX (`/account`)
- **Hronološki prikaz** narudžbina, najnovije prvo.
- **Status badge:** Vizuelni indikator statusa (completed, pending).
- **Sumarni podaci:** Datum, ukupan iznos, lista stavki sa količinama.
- **Prazno stanje:** Poziv na akciju ka prodavnici ako nema narudžbina.