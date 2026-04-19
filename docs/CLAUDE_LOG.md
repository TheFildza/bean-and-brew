# Claude AI Decision Log

## 2026-04-19 — Dodat start.sh (PM2)

**Promjena:** Kreiran `start.sh` za pokretanje aplikacije na serveru putem PM2.

**Odluke:**
- `npm ci --omit=dev` umjesto `npm install` — reproducibilni build, bez dev zavisnosti na produkciji
- `pm2 restart ... --update-env` ako proces već postoji — idempotentna skripta, sigurna za ponovljene deploye
- `--skip-build` flag — omogućava restart bez ponovnog builda (korisno za konfiguracionne promjene)
- Logovi u `logs/` direktorijumu sa `--time` flagom za timestamps
- `pm2 save` na kraju — proces preživljava server reboot (u kombinaciji sa `pm2 startup`)


## 2026-04-19 — Phase 1 Bug Fixes

**Changes made:**
- `Coffee.notes` and `Coffee.image_url` typed as `string | null` to reflect real DB nullable state
- `coffee.notes?.split(',')` — optional chaining prevents crash on NULL DB value
- Image fallback replaced: removed reference to non-existent `/placeholder-coffee.jpg`; now renders a CSS placeholder div when `image_url` is null
- "Add to Cart" button set to `disabled` — Phase 1 has no cart; button will be enabled in Phase 2
- Removed `bcrypt` and `@types/bcrypt` from `package.json` — not used in Phase 1, violates lean architecture constraint
