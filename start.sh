#!/bin/bash
set -e

APP_NAME="bean-and-brew"
APP_DIR="/home/nikibajaopak/web/kafa.nikolafilic.com/public_html"

cd "$APP_DIR"

echo "--- Bean & Brew Deploy: $(date) ---"

# 1. Sync sa prod granom
git fetch origin
git reset --hard origin/prod

# 2. Zavisnosti
npm install

# 3. Build
npm run build

# 4. PM2 restart ili prvi start
if pm2 describe "$APP_NAME" &> /dev/null; then
    pm2 restart "$APP_NAME" --update-env
else
    pm2 start npm --name "$APP_NAME" -- start
fi

pm2 save

echo "[OK] Deploy završen -> kafa.nikolafilic.com"
echo "✅ Sistem je LIVE na kafa.nikolafilic.com"