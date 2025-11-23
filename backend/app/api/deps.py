"""Dependencias compartidas para los endpoints"""
from typing import Annotated
from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

# Type aliases para usar en los endpoints
DBSession = Annotated[AsyncSession, Depends(get_db)]

# Dependency para paginación
def _pagination_params(
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(50, ge=1, le=100, description="Items por página"),
) -> tuple[int, int]:
    return (
        (page - 1) * page_size,  # skip
        page_size,  # limit
    )

PaginationParams = Annotated[tuple[int, int], Depends(_pagination_params)]