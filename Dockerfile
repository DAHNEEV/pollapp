# builder
FROM oven/bun:1.2.18-alpine AS builder

WORKDIR /app

COPY bun.lock package.json tsconfig.json svelte.config.js vite.config.ts ./
COPY drizzle.config.ts ./
COPY src ./src
COPY static ./static

RUN bun install
RUN bun run build

# runner
FROM oven/bun:1.2.18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./

RUN bun install --production

EXPOSE 3000

CMD ["bun", "build/index.js"]
