# Use Node.js LTS as the base image
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install client dependencies
RUN npm install

# Copy the rest of the client code to the working directory
COPY . .

# Build the Vite app for production
RUN npm run build

# Use nginx to serve the build files
FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 to serve the client
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]