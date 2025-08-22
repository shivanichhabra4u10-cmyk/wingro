Sure, here's the contents for the file: /wingrox-ai/wingrox-ai/Dockerfile

FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for both client and server
COPY client/package.json client/package-lock.json ./client/
COPY server/package.json server/package-lock.json ./server/

# Install dependencies for both client and server
RUN cd client && npm install
RUN cd server && npm install

# Copy the rest of the application code
COPY client ./client
COPY server ./server

# Build the client application
RUN cd client && npm run build

# Expose the backend server port
EXPOSE 5000

# Start the backend server
CMD ["node", "server/src/app.js"]