from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import get_settings
from app.database import close_db
from app.api.v1 import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Maneja startup y shutdown events"""
    # Startup
    print(f"🚀 {settings.APP_NAME} iniciando...")
    yield
    # Shutdown
    print("🛑 Cerrando conexiones...")
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    lifespan=lifespan,
    debug=settings.DEBUG,
)

# CORS (para frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: especificar dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers de la API
app.include_router(api_router)


@app.get("/", tags=["Health"])
async def root():
    """Health check"""
    return {
        "message": "Chinook Music Store API",
        "status": "online",
        "version": "0.1.0"
    }


@app.get("/health", tags=["Health"])
async def health():
    """Health endpoint para monitoreo"""
    return {
        "status": "healthy",
        "service": settings.APP_NAME
    }