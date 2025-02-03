FROM node:20.10.0-alpine3.19 AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Production image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Install only the production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the compiled TypeScript files and necessary files from the build stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib

# Copy .env file
COPY .env .env

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm","run","start"]