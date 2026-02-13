# --- Stage 1: Build ---
FROM node:20-bookworm AS builder

WORKDIR /app

# Copy package files & Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Argument untuk Environment Variable (Wajib untuk Vite)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build project (Output: /app/dist)
RUN npm run build

# --- Stage 2: Serve dengan Nginx ---
FROM nginx:alpine

# Copy hasil build dari Stage 1 ke folder Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Konfigurasi Nginx untuk React Router (Single Page Application)
# Ini penting agar saat user refresh halaman di route tertentu (misal /login), tidak error 404
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]