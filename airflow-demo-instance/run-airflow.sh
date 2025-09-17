#!/usr/bin/env bash
set -euo pipefail

# Aller dans le répertoire du script
cd "$(dirname "$0")"

# Récupérer l'UID et GID courants
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)

# Lancer Airflow avec docker compose
echo "🚀 Démarrage d'Airflow..."
docker compose up -d

echo "ℹ️ Pour voir les logs : docker compose logs -f"
