#!/bin/bash

VENV="neurodex_env"

if ! [ -x "python3 -m $VENV" ]; then
  if [ -x "apt" ]; then
    sudo apt install -yqq python3-venv
    echo "Modul 'python3-venv' installiert"
  fi
  # TODO: Add for macos
fi

if ! [ -d "./$VENV" ]; then
  python3 -m venv ./$VENV
  ./$VENV/bin/pip install -r requirements.txt
  echo "Virtuelles Environment '$VENV' wurde erstellt"
  echo "Aktiviere mit:"
  echo "  source ./$VENV/bin/activate"
fi

# Install dependencies from yarn
yarn
