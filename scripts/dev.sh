#!/bin/bash

if [ -z "${VIRTUAL_ENV}" ]; then
	source ./venv/bin/activate
fi

export DATABASE_URL="postgresql://postgres:docker@localhost/postgres"

gunicorn backend.main:app -b localhost:8081 --reload --log-level=DEBUG