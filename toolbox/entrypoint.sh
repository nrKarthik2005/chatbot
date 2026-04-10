#!/usr/bin/env bash
set -euo pipefail

if [ "${SHOW_VERSIONS:-1}" = "1" ]; then
  echo "ansible: $(ansible --version | head -n1)"
  kubectl version --client --short 2>/dev/null || kubectl version --client
fi

if [ "$#" -eq 0 ]; then
  exec bash
fi

exec "$@"
