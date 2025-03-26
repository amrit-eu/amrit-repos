# -------- Base build image --------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Install dependencies
    COPY package.json package-lock.json* ./
    RUN npm install
    
    # Copy the rest of the code
    COPY . .
    
    # Build the Next.js app
    RUN npm run build
    
    # -------- Production image --------
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    # Only copy what's needed to run the app
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/next.config.ts ./
    
    # Set environment
    ENV NODE_ENV=production
    ENV PORT=3000
    
    EXPOSE 3000
    
    # Start the app
    CMD ["npx", "next", "start"]
    