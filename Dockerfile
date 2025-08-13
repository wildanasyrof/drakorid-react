# ---- Base image with corepack (pnpm) enabled ----
FROM node:22-bookworm-slim AS base
ENV NODE_ENV=production
# Ensure a consistent working directory
WORKDIR /app

# Enable corepack so we can use pnpm pinned from lockfile
RUN corepack enable

# ---- Install deps (cached layer) ----
FROM base AS deps
# Copy only manifest files to maximize Docker layer caching
COPY package.json pnpm-lock.yaml ./
# Pre-fetch and install deps exactly as locked
RUN pnpm fetch
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM deps AS build
# Copy the rest of the source
COPY . .
# Build Next.js (outputs to .next)
RUN pnpm build

# ---- Runtime (smallest possible) ----
FROM node:22-bookworm-slim AS runner
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Create a non-root user for security
RUN useradd --user-group --create-home --shell /bin/bash nextjs
USER nextjs

# Only copy what’s needed at runtime
COPY --chown=nextjs:nextjs package.json pnpm-lock.yaml ./
COPY --chown=nextjs:nextjs --from=deps /app/node_modules ./node_modules
COPY --chown=nextjs:nextjs --from=build /app/.next ./.next
COPY --chown=nextjs:nextjs --from=build /app/public ./public
COPY --chown=nextjs:nextjs next.config.mjs ./next.config.mjs
# If you have a .env.production file you want baked in (optional):
# COPY --chown=nextjs:nextjs .env.production ./.env.production

EXPOSE 3000
# Next respects the PORT env var; no need to pass -p
CMD ["node", "node_modules/next/dist/bin/next", "start"]
