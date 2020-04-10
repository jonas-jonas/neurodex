#!/bin/bash

DOCKER="docker"
if [ -x "$(command -v docker.exe)" ]; then
  DOCKER="docker.exe"
  echo "Using docker.exe"
fi

TAG=$(git rev-parse --short HEAD)

eval $DOCKER build -f deploy/Dockerfile -t neurodex/neurodex:$TAG .

eval $DOCKER tag neurodex/neurodex:$TAG neurodex/neurodex:latest
