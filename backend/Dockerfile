# Multi-stage Dockerfile for NestJS Microservices
FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json prisma.config.ts ./
COPY prisma ./prisma/
COPY libs ./libs/
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy all source files
COPY . .

# Build argument for target service (default: api-gateway)
ARG SERVICE_NAME=api-gateway
ENV SERVICE_NAME=${SERVICE_NAME}

# Set Node environment
ENV NODE_ENV=production

# Expose port (3000 for api-gateway)
EXPOSE 3000

# Start the selected service via ts-node
CMD ["sh", "-c", "npx ts-node apps/${SERVICE_NAME}/src/main.ts"]
