# Use official Node image
FROM node:22

# Set working directory
WORKDIR /app

# Disable installing optionalDependencies
# ENV npm_config_optional=false

# Copy dependency definitions first for layer caching
COPY package.json ./

# Install dependencies
RUN npm install @rollup/rollup-linux-x64-gnu --no-save || true
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Run in dev mode with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]