#!/bin/bash

# Start docker-based services via docker-compose
DOCKER_COMPOSE="docker-compose"
if [ -x "$(command -v docker-compose.exe)" ]; then
  DOCKER_COMPOSE="docker-compose.exe"
  echo "Using docker-compose.exe"
fi

eval $DOCKER_COMPOSE -f ./docker-compose.local.yml up -d

if [ -z "${VIRTUAL_ENV}" ]; then
  source ./neurodex_env/bin/activate
fi

export FLASK_ENV="dev"
export DATABASE_URL="postgresql://postgres:docker@localhost:5432/postgres"

gunicorn backend.main:app -b localhost:8081 --reload --log-level=DEBUG
