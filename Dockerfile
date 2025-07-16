# ---------- build ----------
FROM oven/bun:1.2.18-alpine AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN bun run build

# ---------- runtime ----------
FROM oven/bun:1.2.18-alpine AS runtime
RUN apk add --no-cache dumb-init
WORKDIR /app

COPY --from=builder /app/build        ./build
COPY --from=builder /app/drizzle      ./drizzle
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src/lib/server/db/schema.ts ./schema.ts

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["dumb-init", "sh", "-c", "bun run db:migrate && bun run build/index.js"]
