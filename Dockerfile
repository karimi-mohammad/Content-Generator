FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json backend/

# Install dependencies
RUN npm install --production

# Copy backend source
COPY backend/ backend/

# Copy client static files
COPY client/ client/

# Expose port
EXPOSE 4000

# Set working directory to backend
WORKDIR /app/backend

# Start the application
CMD ["npm", "start"]