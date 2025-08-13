# ---- Base ----
FROM node:22-bookworm-slim AS base
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---- Install deps (cached) ----
FROM base AS deps
# Only copy manifests to maximize cache
COPY package.json package-lock.json ./
# Ensure we use npm's lockfile strictly
RUN npm ci

# ---- Build ----
FROM deps AS build
# Copy the rest of the source
COPY . .
# If you need build-time envs, let Easypanel pass them as build args:
# ARG NEXT_PUBLIC_API_BASE_URL
# ARG API_BASE_URL
# ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
# ENV API_BASE_URL=$API_BASE_URL
RUN npm run build

# ---- Prune dev deps for runtime ----
FROM build AS prune
RUN npm prune --omit=dev

# ---- Runtime ----
FROM node:22-bookworm-slim AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Security: non-root user
RUN useradd --user-group --create-home --shell /bin/bash nextjs
USER nextjs

# Minimal runtime files
COPY --chown=nextjs:nextjs package.json ./
COPY --chown=nextjs:nextjs --from=prune /app/node_modules ./node_modules
COPY --chown=nextjs:nextjs --from=build /app/.next ./.next
COPY --chown=nextjs:nextjs --from=build /app/public ./public
COPY --chown=nextjs:nextjs --from=build /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
# Bind to 0.0.0.0 for PaaS (Easypanel) environments
CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
