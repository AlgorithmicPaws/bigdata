# 🎵 Chinook Music Store - Full Stack App

Sistema completo de tienda de música en línea con catálogo, carrito de compras y gestión de ventas. Construido con FastAPI (backend) y React + TypeScript (frontend).

## ✨ Características

### Backend (FastAPI)
- ✅ API REST completa para catálogo de música (Artistas, Álbumes, Tracks, Géneros)
- ✅ Sistema de gestión de clientes (CRUD completo)
- ✅ Sistema de compras con soporte para ventas asistidas y autoservicio
- ✅ Base de datos Chinook extendida con campos personalizados
- ✅ Documentación automática con Swagger/OpenAPI
- ✅ Tests automatizados con pytest
- ✅ Async/await con SQLAlchemy 2.0

### Frontend (React)
- ✅ Catálogo de música navegable con filtros por género y búsqueda
- ✅ Páginas de detalle para canciones, álbumes y artistas
- ✅ Carrito de compras con persistencia en localStorage
- ✅ Proceso completo de checkout
- ✅ Gestión de clientes con creación inline
- ✅ Historial de compras e invoices
- ✅ Diseño responsive y moderno
- ✅ TypeScript para type-safety

## 📦 Stack Tecnológico

### Backend
- **Framework**: FastAPI 0.115.5
- **ORM**: SQLAlchemy 2.0 (async)
- **Base de Datos**: MySQL 8.0+ (AWS RDS compatible)
- **Validación**: Pydantic v2
- **Testing**: pytest-asyncio
- **ASGI Server**: Uvicorn

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Router**: React Router v6
- **State Management**: Context API + React Hooks
- **Styling**: CSS Modules

## 🚀 Instalación y Configuración

### Requisitos Previos
- Python 3.12+
- Node.js 18+ y npm/yarn
- MySQL 8.0+
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/TU_USUARIO/chinook-music-store.git
cd chinook-music-store
```

### 2. Configurar el Backend
```bash
# Navegar a la carpeta del backend
cd backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# Ejecutar migraciones (si aplica)
# O cargar el schema inicial desde Chinook_MySql_AutoIncrementPKs_1_.sql

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload
```

El backend estará disponible en: **http://localhost:8000**

### 3. Configurar el Frontend
```bash
# Navegar a la carpeta del frontend (desde la raíz)
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

## 📚 Documentación de la API

Con el backend corriendo, accede a:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🗂️ Estructura del Proyecto
```
chinook-music-store/
├── backend/
│   ├── app/
│   │   ├── main.py              # Punto de entrada de FastAPI
│   │   ├── database.py          # Configuración de base de datos
│   │   ├── models/              # Modelos SQLAlchemy
│   │   ├── schemas/             # Schemas Pydantic
│   │   ├── routers/             # Endpoints de la API
│   │   └── crud/                # Operaciones CRUD
│   ├── tests/                   # Tests automatizados
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Servicios de API
│   │   │   ├── client.ts        # Cliente HTTP (Axios)
│   │   │   ├── types.ts         # Tipos TypeScript
│   │   │   └── endpoints/       # Endpoints por entidad
│   │   ├── components/          # Componentes React
│   │   │   ├── layout/          # Header, Footer, Layout
│   │   │   └── cart/            # Componentes del carrito
│   │   ├── pages/               # Páginas de la aplicación
│   │   ├── context/             # Context API (CartContext)
│   │   ├── hooks/               # Custom hooks
│   │   ├── config/              # Configuración
│   │   └── types/               # Tipos adicionales
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                        # Documentación adicional
├── docker-compose.yml           # Configuración Docker
└── README.md
```

## 🎨 Páginas del Frontend

### Públicas (Catálogo)
- **Home** (`/`) - Página de inicio con destacados
- **Catálogo** (`/browse`) - Navegación completa con filtros
- **Detalle de Canción** (`/tracks/:id`) - Información detallada
- **Álbumes** (`/albums`) - Listado de álbumes
- **Detalle de Álbum** (`/albums/:id`) - Canciones del álbum
- **Artistas** (`/artists`) - Listado de artistas
- **Detalle de Artista** (`/artists/:id`) - Discografía completa
- **Géneros** (`/genres`) - Explorar por género musical

### Carrito y Compras
- **Carrito** (`/cart`) - Ver y editar items del carrito
- **Checkout** (`/checkout`) - Proceso de compra
- **Detalle de Factura** (`/invoices/:id`) - Confirmación de compra

### Administración
- **Clientes** (`/customers`) - Gestión de clientes (CRUD)
- **Historial** (`/invoices`) - Todas las facturas registradas

## 🧪 Testing

### Backend
```bash
cd backend

# Ejecutar todos los tests
pytest

# Tests con cobertura
pytest --cov=app tests/

# Tests específicos
pytest tests/test_api_catalog.py -v

# Ver reporte de cobertura
pytest --cov=app --cov-report=html
```

### Frontend
```bash
cd frontend

# Linting
npm run lint

# Build de producción
npm run build

# Preview del build
npm run preview
```

## 🗄️ Base de Datos

### Schema
El proyecto utiliza la base de datos **Chinook** extendida con:
- Campo `EmployeeId` opcional en tabla `Invoice` (NULL = venta online, valor = venta asistida)
- Soporte para múltiples items por factura mediante `InvoiceLine`
- Relaciones completas entre entidades

### Diagrama ER
Ver: `Chinook_MySql_AutoIncrementPKs_1_.sql` y `Alteracion_sql_`

### Cargar Schema
```bash
mysql -u username -p database_name < Chinook_MySql_AutoIncrementPKs_1_.sql
mysql -u username -p database_name < Alteracion_sql_
```

## 🐳 Docker Deployment
```bash
# Desarrollo (con hot reload)
docker-compose up

# Producción
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 📡 API Endpoints Principales

### Catálogo
```
GET    /api/v1/artists              # Listar artistas
GET    /api/v1/artists/{id}         # Detalle de artista
GET    /api/v1/albums               # Listar álbumes
GET    /api/v1/albums/{id}          # Detalle de álbum
GET    /api/v1/tracks               # Listar canciones
GET    /api/v1/tracks/{id}          # Detalle de canción
GET    /api/v1/genres               # Listar géneros
```

### Clientes
```
GET    /api/v1/customers            # Listar clientes
POST   /api/v1/customers            # Crear cliente
GET    /api/v1/customers/{id}       # Obtener cliente
PUT    /api/v1/customers/{id}       # Actualizar cliente
DELETE /api/v1/customers/{id}       # Eliminar cliente
```

### Compras
```
POST   /api/v1/invoices             # Crear factura (compra)
GET    /api/v1/invoices             # Listar facturas
GET    /api/v1/invoices/{id}        # Detalle de factura
GET    /api/v1/customers/{id}/invoices  # Historial del cliente
```

## 🔧 Variables de Entorno

### Backend (.env)
```env
# Base de datos
DATABASE_URL=mysql+aiomysql://user:password@host:3306/database

# FastAPI
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Servidor
HOST=0.0.0.0
PORT=8000
```

### Frontend (vite.config.ts o .env)
```env
VITE_API_URL=http://localhost:8000
```

## 🚢 Deployment en Producción

### Backend (AWS EC2 / Cloud)
1. Configurar instancia EC2 con Docker
2. Clonar repositorio
3. Configurar variables de entorno de producción
4. Ejecutar `docker-compose -f docker-compose.prod.yml up -d`
5. Configurar NGINX como reverse proxy
6. Habilitar HTTPS con Let's Encrypt

### Frontend (Vercel / Netlify)
```bash
# Build de producción
cd frontend
npm run build

# Los archivos estáticos estarán en frontend/dist/
# Subir a hosting estático (Vercel, Netlify, S3+CloudFront, etc.)
```

## 🎯 Roadmap

- [ ] Sistema de autenticación (JWT)
- [ ] Roles de usuario (admin, empleado, cliente)
- [ ] Página de estadísticas con gráficos
- [ ] Pasarela de pagos real (Stripe/PayPal)
- [ ] Búsqueda avanzada con filtros combinados
- [ ] Wishlist / Favoritos
- [ ] Reseñas y ratings de canciones
- [ ] Playlists personalizadas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto bajo la [MIT License](LICENSE).

## 👥 Equipo

**Sergio Jauregui**
- GitHub: [@AlgorithmicPaws](https://github.com/AlgorithmicPaws)
- Email: sergio.j.dev@gmail.com

## 🙏 Agradecimientos

- [Chinook Database](https://github.com/lerocha/chinook-database) por Luis Rocha
- [FastAPI](https://fastapi.tiangolo.com/) por Sebastián Ramírez
- [React](https://react.dev/) y la comunidad Open Source

---

⭐ **Si este proyecto te fue útil, considera darle una estrella en GitHub**

📧 **¿Preguntas o sugerencias?** Abre un issue o contáctame directamente.