# ---- Build stage ----
FROM node:20 AS builder
WORKDIR /app

# Install only what's needed using lockfile if present
COPY package*.json ./
RUN npm ci || npm install

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-slim
WORKDIR /app

# Copy only what's needed at runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# If you rely on next.config.mjs at runtime:
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Install production deps (Next needs some runtime deps)
RUN npm ci --omit=dev || npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

# Make sure Next binds to the correct host/port
CMD sh -c "npm start -- -p ${PORT:-3000} -H 0.0.0.0"
