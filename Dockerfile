FROM node:20-bookworm-slim
WORKDIR /app

# Copy package info and install dependencies safely
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js production bundle
RUN npm run build

# Expose the standard Next.js port
EXPOSE 3000

# Default command to run the Next.js web server
CMD ["npm", "run", "start"]
