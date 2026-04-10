#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="chatbot-devops-toolbox:latest"
CURRENT_DIR="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

printf 'Building toolbox image: %s\n' "$IMAGE_NAME"
docker build -f "$SCRIPT_DIR/toolbox/Dockerfile" -t "$IMAGE_NAME" "$SCRIPT_DIR/toolbox"

DOCKER_ARGS=(
  run --rm -it
  -v "$CURRENT_DIR:/workspace"
  -w /workspace
)

if [ -d "$HOME/.kube" ]; then
  DOCKER_ARGS+=(-v "$HOME/.kube:/root/.kube")
fi

if [ -d "$HOME/.ssh" ]; then
  DOCKER_ARGS+=(-v "$HOME/.ssh:/root/.ssh:ro")
fi

DOCKER_ARGS+=("$IMAGE_NAME")

if [ "$#" -gt 0 ]; then
  DOCKER_ARGS+=("$@")
fi

printf 'Running ephemeral toolbox container in %s\n' "$CURRENT_DIR"
docker "${DOCKER_ARGS[@]}"
