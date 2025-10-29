#!/bin/bash
# seed.sh - runs the backend seed script inside the backend container if running, otherwise locally
if [ ! -z "$(docker-compose ps -q backend)" ]; then
  docker exec -it $(docker-compose ps -q backend) node backend/seed.js
else
  node backend/seed.js
fi
