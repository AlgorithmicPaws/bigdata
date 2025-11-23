#!/bin/bash
set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   Music Store - Deployment Script    ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Verificar que existe .env.production
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production no existe${NC}"
    echo ""
    echo "Crea el archivo con:"
    echo "  cp .env.example .env.production"
    echo "  nano .env.production"
    exit 1
fi

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker no está corriendo${NC}"
    echo "Inicia Docker o ejecuta: sudo systemctl start docker"
    exit 1
fi

# Detener contenedores existentes
echo -e "${YELLOW}🛑 Deteniendo contenedores anteriores...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Limpiar imágenes antiguas
echo -e "${YELLOW}🧹 Limpiando imágenes antiguas...${NC}"
docker system prune -f

# Pull últimos cambios (si es desde git)
if [ -d .git ]; then
    echo -e "${YELLOW}📥 Descargando últimos cambios...${NC}"
    git pull origin main || true
fi

# Construir imágenes
echo -e "${BLUE}🏗️  Construyendo imágenes Docker...${NC}"
export COMPOSE_HTTP_TIMEOUT=180
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar servicios
echo -e "${GREEN}▶️  Iniciando servicios...${NC}"
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Esperar a que el backend esté listo
echo -e "${YELLOW}⏳ Esperando a que el backend esté listo...${NC}"
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -f http://localhost:8000/api/v1/artists/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend está respondiendo!${NC}"
        break
    fi
    attempt=$((attempt + 1))
    echo "   Intento $attempt/$max_attempts..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}❌ El backend no responde después de $max_attempts intentos${NC}"
    echo ""
    echo "Mostrando logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=50 backend
    exit 1
fi

# Esperar a que el frontend esté listo
echo -e "${YELLOW}⏳ Esperando a que el frontend esté listo...${NC}"
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -f http://localhost/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend está respondiendo!${NC}"
        break
    fi
    attempt=$((attempt + 1))
    echo "   Intento $attempt/$max_attempts..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}❌ El frontend no responde después de $max_attempts intentos${NC}"
    echo ""
    echo "Mostrando logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=50 frontend
    exit 1
fi

# Obtener IP pública
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "TU-IP-PUBLICA")

# Mostrar información
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║    ✅ Deployment Exitoso!             ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 URLs:${NC}"
echo "   Frontend: http://$PUBLIC_IP"
echo "   API:      http://$PUBLIC_IP:8000"
echo "   Docs:     http://$PUBLIC_IP:8000/docs"
echo ""
echo -e "${BLUE}📊 Comandos útiles:${NC}"
echo "   Ver logs backend:  docker-compose -f docker-compose.prod.yml logs -f backend"
echo "   Ver logs frontend: docker-compose -f docker-compose.prod.yml logs -f frontend"
echo "   Ver estado:        docker-compose -f docker-compose.prod.yml ps"
echo "   Reiniciar:         docker-compose -f docker-compose.prod.yml restart"
echo "   Detener:           docker-compose -f docker-compose.prod.yml down"
echo ""
echo -e "${YELLOW}💡 Tip: Monitorea los logs con:${NC}"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""