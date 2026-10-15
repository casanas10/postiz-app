#!/bin/sh
set -eu
cd /app
# Retain the deployed db-push behavior, but never download a CLI at startup.
prisma db push --skip-generate --schema /app/libraries/nestjs-libraries/src/database/prisma/schema.prisma
nginx -t
nginx
exec pm2-runtime start /app/runtime/ecosystem.config.cjs
