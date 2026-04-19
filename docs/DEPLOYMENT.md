# Deployment Guide: Bean & Brew

Ovaj dokument služi kao operativni priručnik za automatizovani deployment proces. Sistem je dizajniran da osigura maksimalnu stabilnost na Ubuntu 24.04 LTS okruženju koristeći CI/CD pipeline.

## 1. Arhitektura Sistema
Aplikacija koristi automatizovani "Push-to-Deploy" model koji eliminiše potrebu za manuelnim FTP prenosom.

* **Server:** Ubuntu 24.04 LTS (Noble Numbat)
* **Runtime:** Node.js 20+ (LTS)
* **Process Manager:** PM2
* **Web Server:** Nginx (Reverse Proxy via HestiaCP)
* **Database:** Neon PostgreSQL (Serverless)

---

## 2. Strategija Grana (Branching Strategy)
Stroga podela grana osigurava da razvoj ne utiče na stabilnost produkcije.

| Grana | Svrha | Automatski Deploy |
| :--- | :--- | :--- |
| `master` | Razvojna grana. Ovde se vrši integracija funkcija i testiranje. | NE |
| `prod` | Produkciona grana. Predstavlja kod koji je trenutno live na sajtu. | DA |

### Proces objavljivanja (How to Deploy):
Kada je kod na `master` grani stabilan, prebacuje se na `prod` što okida deployment:
```bash
git checkout prod
git merge master
git push origin prod
```
`push` na `prod` automatski pokreće GitHub Actions pipeline.

---

## 3. CI/CD Pipeline (GitHub Actions)

**Fajl:** `.github/workflows/deploy.yml`

**Tok izvršavanja:**
```
git push origin prod
    → GitHub Actions (ubuntu-latest)
        → SSH u VPS
            → bash start.sh
                → git reset --hard origin/prod
                → npm install
                → npm run build
                → pm2 restart bean-and-brew
```

### Potrebni GitHub Secrets

Podesiti u: `GitHub Repo → Settings → Secrets and variables → Actions`

| Secret | Opis |
| :--- | :--- |
| `SSH_PRIVATE_KEY` | ED25519 privatni ključ (generisan na serveru) |
| `SERVER_IP` | IP adresa VPS servera |
| `SERVER_USER` | SSH korisnik (`nikibajaopak`) |

### Generisanje SSH ključa na serveru:
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy  # ← ovaj sadržaj ide u SSH_PRIVATE_KEY secret
```

---

## 4. Nginx Reverse Proxy

HestiaCP konfiguriše Nginx automatski. Za podešavanje reverse proxy-ja ka Next.js (port 3000):

```bash
bash setup-nginx.sh
```

Skripta: `setup-nginx.sh` (u root-u projekta).

Nginx sluša na 80/443 i prosleđuje zahtjeve na `http://127.0.0.1:3000`.

---

## 5. Environment Varijable

**Fajl:** `/home/nikibajaopak/web/kafa.nikolafilic.com/public_html/.env.local`

```env
DATABASE_URL=postgresql://...@...neon.tech/...
ADMIN_PASSWORD_HASH=...    # bcrypt hash admin lozinke
SESSION_SECRET=...         # nasumičan string za potpisivanje cookija
```

`.env.local` je u `.gitignore` — nikad ne commit-ovati.

---

## 6. Ručni Restart (bez deploymenta)

```bash
cd /home/nikibajaopak/web/kafa.nikolafilic.com/public_html
bash start.sh
```

---

## 7. Monitoring

```bash
pm2 status               # status procesa
pm2 logs bean-and-brew   # live logovi
pm2 monit                # CPU/RAM monitoring
```
