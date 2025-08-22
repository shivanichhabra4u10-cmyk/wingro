FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN rm -rf node_modules && \
    npm cache clean --force && \
    npm install && \
    npm install --save tailwind-merge @types/yup formik yup postcss postcss-loader autoprefixer

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
