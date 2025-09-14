# syntax=docker/dockerfile:1

# 1) Base image
FROM node:20-alpine AS base

# 2) Set work directory
WORKDIR /app

# 3) Install dependencies separately for better caching
COPY package*.json ./
RUN npm ci --only=production

# 4) Copy source
COPY . .

# 5) Expose runtime port (Render respects $PORT)
ENV NODE_ENV=production
EXPOSE $PORT

# 6) Start command
CMD ["npm", "start"]


