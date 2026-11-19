# Stage 1: Build Frontend and Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy application source
COPY . .

# Build both backend and frontend
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy package files and install backend production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy compiled backend, data, and built frontend
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/data ./backend/data
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 5000

CMD ["node", "backend/dist/server.js"]
