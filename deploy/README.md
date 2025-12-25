# Postiz Deployment

## Server Info

- **IP**: 65.108.148.171
- **Provider**: Hetzner
- **Domain**: postiz.leaptechai.com
- **Deployment Path**: `/opt/postiz`

## Services

| Service | Container | Port |
|---------|-----------|------|
| Postiz App | postiz | 5000 (internal) |
| PostgreSQL | postiz-postgres | 5432 (internal) |
| Redis | postiz-redis | 6379 (internal) |
| Caddy | caddy | 80, 443 |

## Common Commands

```bash
# SSH into server
ssh root@65.108.148.171

# Navigate to deployment
cd /opt/postiz

# View running containers
docker ps

# View logs
docker logs postiz -f

# Restart postiz (picks up .env changes)
docker compose up -d postiz

# Restart all services
docker compose up -d

# Stop all services
docker compose down
```

## Updating Environment Variables

1. Edit `/opt/postiz/.env` on the server
2. Run `docker compose up -d postiz` to recreate the container

## TikTok Credentials

- **Sandbox**: `sbawsgrccvf5c2wtpe` (for testing)
- **Production**: `awxiv1e4q0n2p0gx` (currently active)
