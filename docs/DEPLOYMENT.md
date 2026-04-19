# Deployment Guide: B & B

This document serves as the operational reference for the automated deployment process. The system is designed to ensure maximum stability on Ubuntu 24.04 LTS using a CI/CD pipeline.

## 1. System Architecture
The application uses an automated "Push-to-Deploy" model that eliminates the need for manual FTP transfers.

* **Server:** Ubuntu 24.04 LTS (Noble Numbat)
* **Runtime:** Node.js 20+ (LTS)
* **Process Manager:** PM2
* **Web Server:** Nginx (Reverse Proxy via HestiaCP)
* **Database:** Neon PostgreSQL (Serverless)

---

## 2. Branching Strategy
A strict branch separation ensures development does not affect production stability.

| Branch | Purpose | Auto Deploy |
| :--- | :--- | :--- |
| `master` | Development branch. Feature integration and testing happen here. | NO |
| `prod` | Production branch. Represents the code currently live on the site. | YES |

### How to Deploy:
When the code on `master` is stable, merge it to `prod` to trigger deployment:
```bash
git checkout prod
git merge master
git push origin prod
```
A `push` to `prod` automatically triggers the GitHub Actions pipeline.

---

## 3. CI/CD Pipeline (GitHub Actions)

**File:** `.github/workflows/deploy.yml`

**Execution flow:**
```
git push origin prod
    → GitHub Actions (ubuntu-latest)
        → SSH into VPS
            → bash start.sh
                → git reset --hard origin/prod
                → npm ci
                → npm run build
                → pm2 reload bean-and-brew
```

### Required GitHub Secrets

Configure in: `GitHub Repo → Settings → Secrets and variables → Actions`

| Secret | Description |
| :--- | :--- |
| `SSH_PRIVATE_KEY` | ED25519 private key (generated on server) |
| `SERVER_IP` | VPS server IP address |
| `SERVER_USER` | SSH user (`nikibajaopak`) |

### Generating the SSH key on the server:
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy  # ← this content goes into the SSH_PRIVATE_KEY secret
```

---

## 4. Nginx Reverse Proxy

HestiaCP configures Nginx automatically. To set up reverse proxy to Next.js (port 3000):

```bash
bash setup-nginx.sh
```

Script: `setup-nginx.sh` (in project root).

Nginx listens on 80/443 and forwards requests to `http://127.0.0.1:3000`.

---

## 5. Environment Variables

**File:** `/home/nikibajaopak/web/kafa.nikolafilic.com/public_html/.env.local`

```env
DATABASE_URL=postgresql://...@...neon.tech/...
ADMIN_PASSWORD_HASH=...                  # bcryptjs hash of admin password (\$ escaping required)
ADMIN_SESSION_TOKEN=...                  # random hex string for admin session
STRIPE_SECRET_KEY=sk_test_...            # Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...          # from Stripe Dashboard → Webhooks
NEXT_PUBLIC_BASE_URL=https://kafa.nikolafilic.com
ANTHROPIC_API_KEY=sk-ant-...             # Claude API key
```

> **Important:** `$` characters in `.env.local` must be escaped as `\$` — Next.js automatically expands `$VAR` in env files.

`.env.local` is in `.gitignore` — never commit it.

---

## 6. Manual Restart (without deployment)

```bash
cd /home/nikibajaopak/web/kafa.nikolafilic.com/public_html
bash start.sh
```

---

## 7. Monitoring

```bash
pm2 status               # process status
pm2 logs bean-and-brew   # live logs
pm2 monit                # CPU/RAM monitoring
```
