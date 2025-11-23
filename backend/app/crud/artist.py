from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models import Artist


async def get_artist(db: AsyncSession, artist_id: int) -> Artist | None:
    """Obtiene un artista por ID"""
    result = await db.execute(
        select(Artist).where(Artist.ArtistId == artist_id)
    )
    return result.scalar_one_or_none()


async def get_artists(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50
) -> tuple[list[Artist], int]:
    """Obtiene lista de artistas con paginación"""
    # Query para contar total
    count_query = select(func.count(Artist.ArtistId))
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Query para datos
    query = select(Artist).offset(skip).limit(limit).order_by(Artist.Name)
    result = await db.execute(query)
    artists = result.scalars().all()
    
    return list(artists), total


async def search_artists(
    db: AsyncSession,
    search: str,
    skip: int = 0,
    limit: int = 50
) -> tuple[list[Artist], int]:
    """Busca artistas por nombre"""
    search_pattern = f"%{search}%"
    
    # Count
    count_query = select(func.count(Artist.ArtistId)).where(
        Artist.Name.ilike(search_pattern)
    )
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Data
    query = (
        select(Artist)
        .where(Artist.Name.ilike(search_pattern))
        .offset(skip)
        .limit(limit)
        .order_by(Artist.Name)
    )
    result = await db.execute(query)
    artists = result.scalars().all()
    
    return list(artists), total