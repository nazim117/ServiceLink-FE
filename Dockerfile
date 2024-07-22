# Stage 1: Build the React application
FROM node:20.10.0-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env.production .env
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
