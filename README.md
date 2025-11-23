# 🎸 Music Store API

Sistema de gestión de ventas de música construido con FastAPI, SQLAlchemy y MySQL.

## 🚀 Características

- ✅ API REST completa para catálogo de música (Artistas, Álbumes, Tracks, Géneros)
- ✅ Sistema de gestión de clientes (CRUD completo)
- ✅ Sistema de compras con soporte para ventas asistidas y online
- ✅ Base de datos Chinook extendida con campos personalizados
- ✅ Documentación automática con Swagger/OpenAPI
- ✅ Tests automatizados
- ✅ Async/await con SQLAlchemy 2.0
- 🔜 Frontend React (próximamente)

## 📦 Tecnologías

- **Backend**: FastAPI 0.115.5
- **ORM**: SQLAlchemy 2.0 (async)
- **Base de Datos**: MySQL (AWS RDS)
- **Testing**: pytest-asyncio
- **Deployment**: Docker + Docker Compose

## 🛠️ Instalación

### Requisitos Previos

- Python 3.12+
- MySQL 8.0+
- Git

### Configuración Local
```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/music-store.git
cd music-store

# 2. Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# 3. Instalar dependencias
cd backend
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# 5. Ejecutar el servidor
uvicorn app.main:app --reload
```

El servidor estará disponible en: http://localhost:8000

## 📚 Documentación de la API

Una vez que el servidor esté corriendo:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Testing
```bash
# Ejecutar todos los tests
pytest

# Tests con cobertura
pytest --cov=app tests/

# Tests específicos
pytest tests/test_api_catalog.py -v
```

## 🗄️ Estructura de la Base de Datos

El proyecto utiliza la base de datos Chinook extendida con:

- Campo `EmployeeId` opcional en `Invoice` (para ventas asistidas vs online)
- Soporte para múltiples items por factura
- Relaciones completas entre todas las entidades

### Diagrama ER

Ver archivo: [Chinook_MySql_AutoIncrementPKs.sql](./docs/database_schema.sql)

## 🐳 Deployment con Docker
```bash
# Desarrollo
docker-compose up

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

Ver [DEPLOYMENT.md](./docs/DEPLOYMENT.md) para instrucciones completas de deployment en AWS EC2.

## 📖 Endpoints Principales

### Catálogo

- `GET /api/v1/artists` - Listar artistas
- `GET /api/v1/albums` - Listar álbumes
- `GET /api/v1/tracks` - Listar tracks
- `GET /api/v1/genres` - Listar géneros

### Clientes

- `GET /api/v1/customers` - Listar clientes
- `POST /api/v1/customers` - Crear cliente
- `PUT /api/v1/customers/{id}` - Actualizar cliente
- `DELETE /api/v1/customers/{id}` - Eliminar cliente

### Compras

- `POST /api/v1/invoices` - Crear factura
- `GET /api/v1/invoices/{id}` - Ver detalle de factura
- `GET /api/v1/invoices/customer/{id}/history` - Historial de compras

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

## 👤 Autor

**Tu Nombre**

- GitHub: [@AlgorithmicPaws](https://github.com/AlgorithmicPaws)

## 🙏 Agradecimientos

- Base de datos Chinook por Luis Rocha
- FastAPI por Sebastián Ramírez
- Comunidad de Python y FastAPI

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub