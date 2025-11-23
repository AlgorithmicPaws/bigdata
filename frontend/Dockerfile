# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Args para configuración en build time
ARG VITE_API_BASE_URL
ARG VITE_API_VERSION=v1

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Crear .env para build
RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env.production && \
    echo "VITE_API_VERSION=${VITE_API_VERSION}" >> .env.production

# Build de producción
RUN npm run build

# Production stage
FROM nginx:alpine

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar los archivos build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración custom de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]