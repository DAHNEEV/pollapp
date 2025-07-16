# ---------- build ----------
FROM oven/bun:1.2.18-alpine AS builder

RUN apk add --no-cache python3 make g++ nodejs npm

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

ENV NODE_ENV=production
RUN bun --bun run build

RUN bunx drizzle-kit migrate

# ---------- runtime ----------
FROM oven/bun:1.2.18-alpine AS runtime
RUN apk add --no-cache dumb-init
WORKDIR /app

COPY --from=builder /app/build             ./build
COPY --from=builder /app/local.db          ./local.db

ENV ORIGIN=http://localhost:3000
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["dumb-init", "bun", "run", "build/index.js"]
