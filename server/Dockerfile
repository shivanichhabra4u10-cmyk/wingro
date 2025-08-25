FROM node:18-alpine AS builder

# Install all necessary build dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    gcc \
    libc-dev \
    linux-headers \
    build-base \
    git \
    openssh-client \
    libc6-compat

WORKDIR /app

# Copy package files and tsconfig
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Clean install all dependencies and build bcrypt from source
RUN npm install

# Copy source code and config
COPY src ./src
COPY .env ./

# Fix tsc permission and build the application
WORKDIR /app
RUN npm run build

# Production stage
FROM node:18-alpine

# Install runtime dependencies needed for bcrypt
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    libc-dev \
    linux-headers

WORKDIR /app

# Copy package files and the entire node_modules
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production \
    PORT=3001

# Start the server
CMD ["npm", "start"]

FROM node:18-alpine AS builder
WORKDIR /app
# Install build dependencies
RUN apk add --no-cache python3 make g++ gcc libc-dev linux-headers git openssh-client libc6-compat
# Copy package files and tsconfig
COPY package*.json ./
COPY tsconfig.json ./
# Install dependencies
RUN npm install
# Copy source code
COPY src ./src
# Debug: list all files and print tsconfig.json before build
RUN ls -l
RUN cat tsconfig.json
# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3001
ENV NODE_ENV=production PORT=3001
CMD ["npm", "start"]
