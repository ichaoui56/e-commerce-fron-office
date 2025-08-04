# Use the official Node.js 18 image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Fix for some native deps compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy lock and package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm again in builder (or copy from deps if caching matters)
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN pnpm run build

# Final production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy Prisma runtime deps
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy Next.js output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
