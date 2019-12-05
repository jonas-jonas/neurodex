#!/bin/sh

export DATABASE_URL="postgresql://postgres:docker@localhost/postgres"

gunicorn backend.main:app -b localhost:8081 --reload