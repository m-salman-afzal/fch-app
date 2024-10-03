# Use an official Node.js runtime as the base image
FROM node:20 
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Update npm to the latest version
RUN npm install -g npm@10.3.0

# Configure Git (as you have in your Dockerfile)
RUN git config --global url."https://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@github.com".insteadOf "ssh://git@github.com"
# Install the application dependencies
RUN npm install
# Copy the application code to the working directory
COPY . .
# Build the application
RUN npm run build
# Expose the port on which the application will run (change it if needed)
EXPOSE 3003
# Start the application
CMD [ "npm", "run", "start" ]
