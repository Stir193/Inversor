.PHONY: build up down seed backup git-init

build:
	docker-compose build

up:
	docker-compose up -d --build

down:
	docker-compose down

seed:
	docker exec -it $(shell docker-compose ps -q backend) node backend/seed.js || node backend/seed.js

backup:
	@echo "Creates a backup of Postgres to ./backups"
	mkdir -p backups
	docker exec -t $(shell docker-compose ps -q postgres) pg_dumpall -c -U inversor > backups/pg_backup_$(shell date +%F).sql

git-init:
	./create_repo.sh
