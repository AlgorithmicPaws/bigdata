from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models import Genre


async def get_genre(db: AsyncSession, genre_id: int) -> Genre | None:
    """Obtiene un género por ID"""
    result = await db.execute(
        select(Genre).where(Genre.GenreId == genre_id)
    )
    return result.scalar_one_or_none()


async def get_genres(db: AsyncSession) -> tuple[list[Genre], int]:
    """Obtiene todos los géneros (son pocos, no necesita paginación)"""
    # Count
    count_query = select(func.count(Genre.GenreId))
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Data
    query = select(Genre).order_by(Genre.Name)
    result = await db.execute(query)
    genres = result.scalars().all()
    
    return list(genres), total