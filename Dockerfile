# Multi-stage build for Next.js (non-standalone) using `next start`
# Uses detection for yarn / npm / pnpm and installs prod deps in the final image.

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# libc6-compat may be needed by some native deps on Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /

# Copy manifests
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies based on the preferred package manager
RUN set -eux; \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /
COPY --from=deps /node_modules ./node_modules
COPY . .

# Disable Next telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build (auto-picks your package manager via lockfile present)
# If using yarn:
# RUN yarn build
# If using pnpm:
# RUN pnpm build
# Default to npm if package-lock exists:
RUN if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm build; \
    else echo "No lockfile found for build step" && exit 1; \
    fi

# Production image
FROM base AS runner
WORKDIR /

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy only what's needed at runtime
COPY --from=builder /public ./public
COPY --from=builder /.next ./.next

# Copy package manifests so we can install prod-only deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install production dependencies only
RUN set -eux; \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile --production; \
    elif [ -f package-lock.json ]; then npm ci --omit=dev; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile --prod; \
    else echo "Lockfile not found." && exit 1; \
    fi

USER nextjs

EXPOSE 3000

# Start Next.js in production mode
CMD [ \
  "sh", "-c", \
  "if [ -f yarn.lock ]; then yarn start; elif [ -f package-lock.json ]; then npm run start; elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm start; else echo 'No lockfile found.' && exit 1; fi" \
]
