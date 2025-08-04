# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies (just copy lockfiles)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./

# Builder - install all dependencies, generate Prisma client, build app
FROM base AS builder
RUN npm install -g pnpm
WORKDIR /app

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .

RUN pnpm install --frozen-lockfile   # installs dev + prod deps
RUN npx prisma generate
RUN pnpm run build

# Runner - production image
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy Prisma runtime files (should exist now)
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy standalone Next.js output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir .next && chown nextjs:nodejs .next

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
