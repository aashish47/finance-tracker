FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# -----------------------------
# Dependencies
# -----------------------------
FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack prepare pnpm@10.33.2 --activate && \
    pnpm install --frozen-lockfile

# -----------------------------
# Builder
# -----------------------------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.local .
RUN corepack prepare pnpm@10.33.2 --activate && \
    pnpm build

# -----------------------------
# Runner
# -----------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]