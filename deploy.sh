#!/bin/bash
set -e

# ===========================================
# Deploy script для origo (front)
# ===========================================
# Первая установка:  bash deploy.sh init
# Обновление:        bash deploy.sh update
# Остановка:         bash deploy.sh down
# Логи:              bash deploy.sh logs
# ===========================================

COMPOSE_FILE="docker-compose.prod.yml"

case "$1" in
  init)
    echo "🚀 Первый запуск origo-front..."
    docker compose -f $COMPOSE_FILE up -d --build
    echo ""
    echo "✅ Проект запущен!"
    echo "🌐 Сайт: http://$(curl -s ifconfig.me)"
    ;;

  update)
    echo "🔄 Обновление..."
    git pull origin main
    docker compose -f $COMPOSE_FILE build --no-cache web
    docker compose -f $COMPOSE_FILE up -d
    echo "✅ Обновление завершено!"
    ;;

  down)
    echo "🛑 Остановка..."
    docker compose -f $COMPOSE_FILE down
    echo "✅ Остановлено."
    ;;

  logs)
    docker compose -f $COMPOSE_FILE logs -f --tail=100
    ;;

  status)
    docker compose -f $COMPOSE_FILE ps
    ;;

  *)
    echo "Использование: bash deploy.sh {init|update|down|logs|status}"
    exit 1
    ;;
esac
