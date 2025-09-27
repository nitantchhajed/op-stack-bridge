# ---- Build stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm i

# Copy source (including .env for CRA build-time)
COPY . .

# Build production bundle
RUN npm run build

# ---- Run stage ----
FROM node:18-alpine

WORKDIR /app

# Install a lightweight static server
RUN npm i -g serve@14.2.1

# Copy built assets
COPY --from=builder /app/build /app/build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]


