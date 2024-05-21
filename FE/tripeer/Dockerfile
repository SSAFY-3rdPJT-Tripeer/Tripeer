# Use a node base image
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and other related files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the application
RUN npm run build

# Serve the app using a minimal base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy the build output directory from the builder stage
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json .

# Expose the port next app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
