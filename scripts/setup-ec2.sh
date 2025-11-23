#!/bin/bash
set -e

echo "🚀 Configurando EC2 para Music Store..."
echo "=========================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que se ejecuta como usuario normal (no root)
if [ "$EUID" -eq 0 ]; then 
    echo "❌ No ejecutes este script como root"
    exit 1
fi

# Actualizar sistema
echo -e "${GREEN}📦 Actualizando sistema...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# Instalar dependencias
echo -e "${GREEN}📦 Instalando dependencias...${NC}"
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    git \
    htop \
    vim

# Instalar Docker
echo -e "${GREEN}🐳 Instalando Docker...${NC}"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Instalar Docker Compose
echo -e "${GREEN}🔧 Instalando Docker Compose...${NC}"
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Agregar usuario a grupo docker
echo -e "${GREEN}👤 Configurando permisos de Docker...${NC}"
sudo usermod -aG docker $USER

# Configurar firewall (UFW)
echo -e "${GREEN}🔥 Configurando firewall...${NC}"
sudo ufw --force enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 8000/tcp  # Backend
sudo ufw allow 80/tcp    # HTTP (futuro)
sudo ufw allow 443/tcp   # HTTPS (futuro)

# Crear directorio de trabajo
echo -e "${GREEN}📁 Creando directorio de trabajo...${NC}"
mkdir -p ~/music-store
cd ~/music-store

# Verificar instalación
echo ""
echo -e "${GREEN}✅ Instalación completada!${NC}"
echo "=========================================="
echo ""
echo "Versiones instaladas:"
echo "  - Docker: $(docker --version)"
echo "  - Docker Compose: $(docker-compose --version)"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "  Ejecuta uno de estos comandos para aplicar cambios:"
echo "    - newgrp docker"
echo "    - logout y vuelve a conectar"
echo ""
echo -e "${GREEN}📝 Siguiente paso:${NC}"
echo "  1. cd ~/music-store"
echo "  2. git clone https://github.com/TU_USUARIO/music-store.git ."
echo "  3. cp .env.example .env.production"
echo "  4. nano .env.production  # Configura tus credenciales"
echo "  5. bash scripts/deploy.sh"
echo ""