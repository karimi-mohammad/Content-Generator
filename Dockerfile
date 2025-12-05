FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json backend/

# Copy client static files
COPY client/ client/

# Set working directory to backend
WORKDIR /app/backend

# Install dependencies
RUN npm install --production

# Copy backend source
COPY backend/ ./

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]