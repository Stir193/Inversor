#!/bin/bash
# backup.sh - backup postgres to backups/ with timestamp
mkdir -p backups
if [ ! -z "$(docker-compose ps -q postgres)" ]; then
  docker exec -t $(docker-compose ps -q postgres) pg_dumpall -c -U inversor > backups/pg_backup_$(date +%F).sql
  echo "Backup created in backups/pg_backup_$(date +%F).sql"
else
  echo "Postgres container not running. Run docker-compose up -d postgres first."
fi
