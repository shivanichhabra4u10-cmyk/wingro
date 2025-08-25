FROM node:18-alpine AS builder
WORKDIR /app
# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    libc-dev \
    linux-headers \
    git \
    openssh-client \
    libc6-compat
# Copy package files and tsconfig
COPY package*.json ./
COPY tsconfig.json ./
# Install dependencies
RUN npm install
# Copy source code
COPY src ./src
# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Debug: list contents of /app and /app/src before build
RUN ls -l /app
RUN ls -l /app/src
EXPOSE 3001
ENV NODE_ENV=production PORT=3001
CMD ["npm", "start"]
