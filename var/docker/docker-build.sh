#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
revision=$(git rev-parse HEAD)
image=${POSTIZ_BUILD_IMAGE:-postiz-runtime:sha-${revision}}
docker buildx build --platform linux/arm64 --file Dockerfile.runtime --target runtime \
  --build-arg "VCS_REF=${revision}" \
  --build-arg "NEXT_PUBLIC_VERSION=$(cat version.txt)" \
  --load --tag "$image" .
printf 'Built %s\n' "$image"
