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

### Established package access

On 2026-10-15 UTC, the owner approved adding only `read:packages` to the existing
Mac GitHub CLI login and completed GitHub's device authorization. The authenticated
owner package listing succeeded with zero container packages; the exact
`postiz-app` lookup returned 404. The owner subsequently approved activating
these changes on `main`, creating the private package with repository Actions
access, enabling the publication gate and publishing the tested runtime.

The scoped packaging changes are active on `main`; the old `pull_request_target`
workflow with `write-all` has been replaced by the read-only PR workflow. The
package is now **private** and linked to `casanas10/postiz-app`. Its settings give
only this repository Actions **Write** access. Source-repository access inheritance
is disabled; there are no additional package members or Codespaces grants.
The approval variable is set to `ghcr.io/casanas10/postiz-app:private`.

The one-time `bootstrap-ghcr.yml` workflow is disabled. Do not rerun it for this
existing package. Routine release jobs use the short-lived `GITHUB_TOKEN`; no
owner credential or long-lived publishing token is copied to a runner.

### Initialization evidence

The [first setup run](https://github.com/casanas10/postiz-app/actions/runs/38669657586)
stopped before upload because the Actions-token account-wide package listing
returned HTTP 400. The approved owner login successfully verified absence, and
the corrected dispatcher supplied that fresh check without sending its credential
to the runner.

The [marker run](https://github.com/casanas10/postiz-app/actions/runs/38669875372)
uploaded only a tiny public-text README, not any application, data or credentials.
Although GitHub's documentation describes private initial visibility, the actual
package was initially public. The visibility assertion failed and publication was
blocked. GitHub's settings exposed and accepted a Private selection; both UI and
the owner-authenticated API then confirmed private visibility at 02:16:21 UTC.
Actions access was reduced from Admin to Write and inheritance disabled before
any runtime publication. No package or version was deleted. The retained marker
digest is `sha256:d0b9abbaa7c9a7fb4134107344d03fd26ca030ac927ea78981bf5a9c75ab6eae`.

Only after owner metadata independently confirms private visibility should
`build-containers.yml` be manually dispatched on the reviewed
commit with `publish=true`. The ordinary release job still rejects missing or
non-private packages. Package creation does not authorize production rollout.

### Production read access remains a separate approval

Production pulls need an expiring classic PAT with **read:packages only**, owned
by an identity allowed to read this package. Enter it through a secure terminal
or secret handoff, never chat, a command argument, Git, a build arg or a log.
Credential creation, storage, package access changes and approval-variable setup
require separate approval. No write/delete package PAT is required for
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

### Prepared rollback evidence

A fresh protected backup and restore rehearsal completed at 02:21 UTC on
2026-10-15. The server directory is
`/root/postiz-runtime-release-20261015T022102Z` (mode 0700, about 59 MiB including
the extracted comparison files). It contains a PostgreSQL custom dump, uploads
and config archives, Compose/environment backups, the current image ID and
SHA-256 checksums. Secrets and application data stayed on the server.

The dump restored successfully with `pg_restore --exit-on-error` into an isolated
PostgreSQL container, producing 45 public base tables. Media and config archives
were extracted and compared successfully. The rehearsal used no network, host
ports or production mounts, with 512 MiB memory and 0.5 CPU limits. Its stopped
container is retained; no existing container, volume or image was deleted.
The database dump and file archives are individually consistent, but live writes
were not paused for a cross-database/filesystem transaction snapshot.

The production image ID and both named mounts were rechecked, and existing
`json-file` logging remains capped at 10m × 3. Production Postiz, PostgreSQL and
Redis stayed running throughout. The private-image pull credential and final
image-only replacement still require separate approval.

The previous retention evidence at
`/root/postiz-retention-backup-20261014T122132Z/verified-result.json` contains a
stale order-sensitive mount comparison. The prior audit subsequently verified
identical mounts read-only. This branch does not retry its denied report write.

## Published release — 2026-10-15 UTC

[Run 38670168905](https://github.com/casanas10/postiz-app/actions/runs/38670168905)
completed successfully for source `b637fdb269e2064423c96b2864a34bbd79edda86`.
Native ARM64 validation passed in 10m 16s; the separate build, test and private
publication job passed in 11m 18s. The published image ID is
`sha256:96e40321c5028a16ecb90fb2538f9ef0512bc1c55147cab710cef17298372b68`.

Use this immutable deployment reference after the production approval gate:

```
ghcr.io/casanas10/postiz-app@sha256:590ad8188b733dd43efc5eebebd04c465924d955317662c48dde6b41ca2a9d12
```

The tag is
`sha-b637fdb269e2064423c96b2864a34bbd79edda86-run-38670168905-1-arm64`.
The publishing job and independent owner API check both confirmed private
visibility after upload. Anonymous metadata and registry pull-authorization
checks were denied. The package retains its bootstrap marker as a second version.

| Comparable uncompressed layer total | Bytes | GiB |
| --- | ---: | ---: |
| Current production image | 6,303,768,576 | 5.87 |
| Published runtime | 3,140,385,610 | 2.92 |
| Reduction | 3,163,382,966 | 2.95 |

Reduction: **50.18%**. This does not claim compressed registry
transfer savings or freed production disk space. All old images remain.

The native dependency, isolated database, four-process stability (zero restarts),
HTTP/static asset, PNG/media and restart checks passed on the exact published
image. No real social account was used. Production remains on the preserved old
image; a dedicated private-pull credential and rollout approval are still pending.
`validation.json` records the source, image and registry hashes, exact measurements,
earlier successful validation runs and remaining limits. Documentation/evidence
follow-ups do not change the tested runtime recipe, application or smoke tests.
