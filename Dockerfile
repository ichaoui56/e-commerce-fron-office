# -------- Base image --------
    FROM node:18-alpine AS base
    RUN apk add --no-cache libc6-compat
    WORKDIR /app
    
    # -------- Dependencies layer --------
    FROM base AS deps
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Copy lockfiles and install only production dependencies
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile --prod
    
    # -------- Builder layer --------
    FROM base AS builder
    
    # Install pnpm again
    RUN npm install -g pnpm
    
    # Copy all files and dependencies from deps
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Install full dependencies for build (if needed)
    RUN pnpm install --frozen-lockfile
    
    # Generate Prisma Client
    RUN npx prisma generate
    
    # Build Next.js with standalone output
    RUN pnpm run build
    
    # -------- Production runner --------
    FROM base AS runner
    
    # Create non-root user
    RUN addgroup --system --gid 1001 nodejs && \
        adduser --system --uid 1001 nextjs
    
    WORKDIR /app
    ENV NODE_ENV=production
    ENV PORT=3000
    ENV HOSTNAME=0.0.0.0
    
    # Copy necessary files
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./package.json
    
    # Copy Prisma runtime files
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    # Copy Next.js standalone output
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    
    # Ensure proper permissions
    RUN mkdir .next && chown nextjs:nodejs .next
    
    USER nextjs
    
    EXPOSE 3000
    
    # ✅ Correct command for standalone mode
    CMD ["node", "server.js"]
    