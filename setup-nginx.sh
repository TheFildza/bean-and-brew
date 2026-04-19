#!/bin/bash

# Senior Architect Script: Nginx Proxy Override for HestiaCP
# Autor: Nikola Filić
# Svrha: Automatizacija Nginx Reverse Proxy-ja za Next.js na HestiaCP sistemu

DOMAIN="kafa.nikolafilic.com"
CONF_PATH="/etc/nginx/conf.d/domains/${DOMAIN}.ssl.conf"
BACKUP_PATH="${CONF_PATH}.bak"

echo "🛠️  Pokrećem Nginx konfigurator za ${DOMAIN}..."

# 1. Backup postojeće konfiguracije
if [ -f "$CONF_PATH" ]; then
    cp "$CONF_PATH" "$BACKUP_PATH"
    echo "✅ Backup napravljen na: ${BACKUP_PATH}"
else
    echo "❌ Greška: Konfiguracioni fajl nije pronađen na ${CONF_PATH}"
    exit 1
fi

# 2. Injekcija Proxy logike
# Koristimo sed da zamenimo standardni location / blok
echo "💉 Ubrizgavam Proxy Pass (port 3000)..."

python3 - <<EOF
import re

conf_path = "$CONF_PATH"
with open(conf_path, 'r') as f:
    content = f.read()

proxy_config = """    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }"""

# Pronalazi prvi location / blok i menja ga
new_content = re.sub(r'location / \{.*?\n    \}', proxy_config, content, flags=re.DOTALL)

with open(conf_path, 'w') as f:
    f.write(new_content)
EOF

# 3. Testiranje i Restart
echo "🧪 Testiram Nginx sintaksu..."
if nginx -t; then
    systemctl restart nginx
    echo "🚀 Nginx uspešno restartovan! Proveri https://${DOMAIN}"
else
    echo "⚠️  Nginx test nije prošao! Vraćam backup..."
    cp "$BACKUP_PATH" "$CONF_PATH"
    systemctl restart nginx
fi