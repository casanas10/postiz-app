# Postiz ARM64 runtime release

This branch changes packaging and CI only. Its application baseline is
`871dda4e7de40a42bab2a399352166d1c62198fc` (Postiz v1.47.0). The production
source audit matched 671/671 selected application/build files to this baseline.
The separate `codex/tiktok-public-readiness` work is not included.

## Image contents and behavior

`Dockerfile.runtime` uses separate build, production-dependency and final runtime
stages. The final image has built backend/worker/cron code, Next output and public
assets, production Node dependencies, generated Prisma client/schema, nginx,
PM2 6.0.14 and Prisma CLI 6.5.0. The deployed Node 22.20 line is retained.
The build uses pnpm 10.6.1 with the existing frozen lockfile and an explicit
hoisted layout. Developer `.npmrc` files and environment files are not sent to
Docker.

The final stage does not copy the pnpm store, Next build cache, application
TypeScript source, `.git`, a pnpm executable, OS compilers or Python. Some
historically misclassified build-related packages remain in the root production
dependency graph; this change does not hand-delete transitive dependencies.

Startup still runs Prisma `db push` (without force/reset/accept-data-loss), then
nginx and all four processes. The CLI is installed in the image, so startup no
longer downloads it. PM2 starts Node directly and sends application stdout/stderr
to Docker logging. Nginx access/error files point to stdout/stderr. Production Compose's existing 10m × 3 rotation remains the
host-side cap. PM2's own small metadata/daemon files live under `/tmp/postiz-pm2`.
No claim of a strict cap on every internal file is made.

## Local isolated validation

Run only when Mac disk headroom and concurrent workload coordination permit:

```sh
bash var/docker/docker-build.sh
POSTIZ_TEST_IMAGE=postiz-runtime:sha-$(git rev-parse HEAD) bash var/docker/runtime/smoke.sh
```

The smoke project uses fresh PostgreSQL and Redis, tmpfs storage and an internal
Docker network. It has no host ports, production mounts, real users, credentials
or social accounts. It checks ARM64, omitted build files/tools, native bcrypt,
Sharp PNG processing, Prisma, Sentry profiling, frontend HTML/static files,
backend authentication, serving media, all four PM2 processes and a restart.
Only containers/network created by that test project are removed on exit.

## GitHub Actions and private GHCR

`build-containers.yml` uses GitHub's standard `ubuntu-24.04-arm` runner. It runs
validation on this branch and supports manual dispatch. A build-only run has
`contents: read` and cannot publish. No image tar is uploaded as a public workflow
artifact.

Publishing is a separate job with an ephemeral `GITHUB_TOKEN` and
`packages: write`. It runs only when all of these hold:

1. Validation passes, and dispatch explicitly requests `publish=true`.
2. The repository is exactly `casanas10/postiz-app`.
3. After action-time approval, repository variable `POSTIZ_GHCR_APPROVED` is set
   to `ghcr.io/casanas10/postiz-app:private`.
4. The package metadata API confirms **private** visibility and linkage to this
   repository. A 403 or 404 fails closed, with no push or visibility change.

The exact pushed image is built and smoke-tested in the publishing job. Tags
include full source SHA, workflow run ID and attempt; no mutable `latest` tag is
written. The run summary records image ID, size and registry digest. Deployment
must use the digest. There is no SSH credential or production deployment step.
The PR workflow has no package-write token and never publishes.

### Required secure handoff before first publication

Package inspection previously failed with missing `read:packages`; that denial
has not been bypassed. Repository admin access does not establish GHCR access.
An approved package read identity is needed to establish whether
`ghcr.io/casanas10/postiz-app` already exists and is private. If it exists without
repository access, linking/granting access requires separate action-time
approval. If it is absent, first-package initialization also requires explicit
approval of its repository access; the current release workflow intentionally
cannot bootstrap an unverified package.

Production pulls need an expiring classic PAT with **read:packages only**, owned
by an identity allowed to read this package. Enter it through a secure terminal
or secret handoff, never chat, a command argument, Git, a build arg or a log.
Credential creation, storage, package access changes and approval-variable setup
are not performed by this branch. No write/delete package PAT is required for
routine builds. No paid runner or plan is configured.

## Production rollout gate and rollback

No production rollout is authorized by this branch. Before proposing one:

- Record passing test run, source SHA, image digest, architecture and measured
  size; compare the application's content baseline and Prisma schema.
- Verify production can pull the private digest with the approved read identity.
- Preserve the current image and all existing rollback candidates; do not prune.
- Take fresh database/upload and Compose backups, then rehearse restoring them
  against disposable resources. `db push` means data rollback cannot be replaced
  by simply selecting an older image if a future release changes schema.
- Present the exact Compose image-only change, expected brief interruption,
  probes and rollback commands for approval.

Current production fallback, recorded 2026-10-15:

```
postiz-custom:latest
sha256:3fccf0a2ba1be2ad6bafc234672fc6ca3bd44fecb5e08de45818b192d5cbf5bf
```

The approved change would replace only `services.postiz.image` with
`ghcr.io/casanas10/postiz-app@sha256:<tested-manifest-digest>`, retaining environment,
networks, mounts and logging. Only the Postiz service would be recreated with
`docker compose up -d --no-deps --no-build postiz` after an explicit pull. A
failure would restore the backed-up Compose image reference and recreate only
Postiz using `--pull never`; retain the old image before starting this process.
Database/Redis/Caddy and the monitoring stack should not be recreated for an
image-only rollout.

The previous retention evidence at
`/root/postiz-retention-backup-20261014T122132Z/verified-result.json` contains a
stale order-sensitive mount comparison. The prior audit subsequently verified
identical mounts read-only. This branch does not retry its denied report write.
