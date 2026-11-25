#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

playwright_version=$(node -p "require('./package-lock.json').packages['node_modules/playwright'].version")
node_major=$(cut -d. -f1 .nvmrc)
image="mcr.microsoft.com/playwright:v${playwright_version}-noble"

docker run --rm --ipc=host \
  -v "$PWD":/source:ro \
  -v daily-chunk-ci-npm:/root/.npm \
  "$image" bash -c "
    set -euo pipefail
    npm install -g --force node@${node_major} >/dev/null
    hash -r
    echo \"node \$(node -v)\"
    mkdir /work && cd /work
    tar -C /source --exclude=node_modules --exclude=.nx --exclude=dist --exclude=storybook-static --exclude=.git -cf - . | tar -xf -
    npm ci --no-audit --no-fund
    (cd apps/app && npx playwright install --with-deps chromium)
    npx nx run-many -t test --skip-nx-cache
    npx nx run @daily-chunk/app:e2e --skip-nx-cache
  "
