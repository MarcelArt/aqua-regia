# Use the official Bun image
FROM oven/bun:1-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source files
COPY . .

# Set default environment variables (can be overridden)
ENV API_BASE_URL="https://aimas.bangmarcel.art/api"
ENV SOURCE_BASE_URL="https://harga-emas.org"

# Run the application
CMD ["bun", "run", "index.ts"]
