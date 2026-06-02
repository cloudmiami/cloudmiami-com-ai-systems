# Stage 1: Build the Vite frontend app from the website folder
FROM node:22-alpine AS build-stage
WORKDIR /app

# 1. Copy package files specifically from the website directory
COPY website/package*.json ./
RUN npm ci

# 2. Copy the rest of the website code and build it
COPY website/ .
RUN npm run build

# Stage 2: Serve the compiled assets using clean Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
