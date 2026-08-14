# Stage 1: Build React Vite Application
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default files and copy built assets
RUN rm -rf ./*
COPY --from=builder /app/dist ./
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
