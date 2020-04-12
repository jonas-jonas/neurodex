#!/bin/bash

# Start docker-based services via docker-compose
DOCKER_COMPOSE="docker-compose"
if [ -x "$(command -v docker-compose.exe)" ]; then
  DOCKER_COMPOSE="docker-compose.exe"
  echo "Using docker-compose.exe"
fi

eval $DOCKER_COMPOSE -f ./deploy/docker-compose.local.yml up -d

if [ -z "${VIRTUAL_ENV}" ]; then
  source ./neurodex_env/bin/activate
fi

export FLASK_ENV="development"
export DATABASE_URL="postgresql://postgres:docker@localhost:5432/postgres"
source ./.env.local
export SENDGRID_API_KEY=$SENDGRID_API_KEY

gunicorn backend.main:app -c backend/gunicorn.py
