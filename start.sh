#!/bin/bash
set -e

APP_NAME="bean-and-brew"
APP_DIR="/home/nikibajaopak/web/kafa.nikolafilic.com/public_html"
HEALTH_URL="http://localhost:3000/api/health"

cd "$APP_DIR"

echo "--- B&B Deploy: $(date) ---"

# Save current commit for rollback
PREV_COMMIT=$(git rev-parse HEAD)

# 1. Sync with prod branch
git fetch origin
git reset --hard origin/prod

# 2. Deterministic install
npm ci

# 3. Build — rollback on failure
if ! npm run build; then
  echo "[FAIL] Build failed — rolling back to $PREV_COMMIT"
  git reset --hard "$PREV_COMMIT"
  npm ci --prefer-offline
  npm run build
  pm2 reload "$APP_NAME" --update-env 2>/dev/null || pm2 start npm --name "$APP_NAME" -- start
  pm2 save
  echo "[ROLLBACK] Restored to $PREV_COMMIT"
  exit 1
fi

# 4. Zero-downtime restart
if pm2 describe "$APP_NAME" &> /dev/null; then
  pm2 reload "$APP_NAME" --update-env
else
  pm2 start npm --name "$APP_NAME" -- start
fi

pm2 save

# 5. Health check
sleep 3
if curl -sf "$HEALTH_URL" > /dev/null; then
  echo "[OK] Deploy complete — kafa.nikolafilic.com is LIVE"
else
  echo "[WARN] Health check did not respond — check pm2 logs"
fi
