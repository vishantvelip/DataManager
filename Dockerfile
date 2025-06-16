# Use official Node.js LTS image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (change if your app uses a different port)
EXPOSE 8000

# Start the application
CMD ["node", "app.js"]
