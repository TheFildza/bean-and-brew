#!/bin/bash

# Bean & Brew — Production Ready Startup Script
# Autor: Nikola Filić
# Svrha: Siguran build i PM2 management

set -e

APP_NAME="bean-and-brew"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$APP_DIR"

echo "☕ Bean & Brew: Pokrećem produkcioni ciklus..."

# 1. Čišćenje i instalacija (Samo ako fali node_modules)
if [ ! -d "node_modules" ]; then
    echo "📦 Node modules nisu pronađeni. Instaliram..."
    npm install
fi

# 2. Build proces (Ključan korak koji je falio)
echo "🏗️  Generišem novi produkcioni build..."
npm run build

# 3. PM2 Smart Restart
# Proveravamo da li proces već postoji
if pm2 describe "$APP_NAME" &> /dev/null; then
    echo "🔄 Proces postoji, radim restart..."
    pm2 restart "$APP_NAME" --update-env
else
    echo "🚀 Prvo pokretanje procesa..."
    pm2 start npm --name "$APP_NAME" -- start
fi

# 4. Perzistencija
pm2 save

echo ""
echo "✅ Sistem je LIVE na kafa.nikolafilic.com"
echo "📊 Status: pm2 status"