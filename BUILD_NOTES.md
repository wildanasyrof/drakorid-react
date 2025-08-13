# Docker builds for your Next.js app

We generated two variants:

1. **Dockerfile** — Uses `next start` (works with your current config).  
2. **Dockerfile.standalone** — Uses Next.js `output: 'standalone'` for a smaller image. Use this if you add `output: 'standalone'` to `next.config.*`.

## Build & run (non-standalone)

```bash
docker build -t myapp:latest -f Dockerfile .
docker run --rm -p 3000:3000 myapp:latest
```

## Build & run (standalone)
Enable standalone in `next.config.*`, then:

```bash
docker build -t myapp-standalone:latest -f Dockerfile.standalone .
docker run --rm -p 3000:3000 myapp-standalone:latest
```

Both Dockerfiles autodetect your package manager (yarn / npm / pnpm) using the lockfile(s).
