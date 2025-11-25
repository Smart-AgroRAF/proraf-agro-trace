# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_BLOCKCHAIN_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_AUTH_ENABLED
ARG VITE_API_KEY
ARG VITE_ENV
ARG VITE_ERC

# Set environment variables from build args
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BLOCKCHAIN_API_URL=$VITE_BLOCKCHAIN_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_AUTH_ENABLED=$VITE_GOOGLE_AUTH_ENABLED
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_ENV=$VITE_ENV
ENV VITE_ERC=$VITE_ERC

# Install dependencies (cache layer)
COPY package.json bun.lockb ./
RUN npm install -g bun && bun install

# Copy source code
COPY . .

# Build application
RUN bun run build

# Production stage
FROM nginx:alpine AS production

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]