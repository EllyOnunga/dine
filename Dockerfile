# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:20-slim

WORKDIR /app

# Copy production dependencies
COPY --from=builder /app/package*.json ./
# We need drizzle configs and schema for db:push
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/shared ./shared

# Install only production dependencies
# Note: drizzle-kit and tsx are now in dependencies
RUN npm install --omit=dev

# Copy built assets
COPY --from=builder /app/dist ./dist

# Copy migrations and migration script
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/script ./script

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Create a startup script to run migrations before starting the server
RUN echo '#!/bin/sh\nnpm run db:migrate\nnpm start' > /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
