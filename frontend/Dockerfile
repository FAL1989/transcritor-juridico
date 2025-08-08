FROM node:18-alpine

WORKDIR /app

# Build-time API URL (set via --build-arg)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application (will inline NEXT_PUBLIC_API_URL)
RUN npm run build

# Expose port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]