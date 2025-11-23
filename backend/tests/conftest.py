import pytest
import pytest_asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.database import Base
from app.config import get_settings
from app.main import app


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Crea una sesión de base de datos para testing"""
    settings = get_settings()
    
    # Crear nuevo engine para cada test
    engine = create_async_engine(
        settings.database_url,
        echo=False,
        pool_pre_ping=True,
        pool_size=1,  # Solo 1 conexión por test
        max_overflow=0,  # Sin overflow
    )
    
    async_session = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.rollback()
            await session.close()
    
    # Cerrar engine después de cada test
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")  
async def async_client():
    """Crea un cliente HTTP async nuevo para cada test"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client