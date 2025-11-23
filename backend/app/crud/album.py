from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.models import Album


async def get_album(db: AsyncSession, album_id: int) -> Album | None:
    """Obtiene un álbum por ID con su artista"""
    result = await db.execute(
        select(Album)
        .options(selectinload(Album.artist))
        .where(Album.AlbumId == album_id)
    )
    return result.scalar_one_or_none()


async def get_albums(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    artist_id: int | None = None
) -> tuple[list[Album], int]:
    """Obtiene lista de álbumes con paginación"""
    # Base query
    base_query = select(Album).options(selectinload(Album.artist))
    
    # Filtro por artista si se especifica
    if artist_id:
        base_query = base_query.where(Album.ArtistId == artist_id)
    
    # Count
    count_query = select(func.count(Album.AlbumId))
    if artist_id:
        count_query = count_query.where(Album.ArtistId == artist_id)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Data
    query = base_query.offset(skip).limit(limit).order_by(Album.Title)
    result = await db.execute(query)
    albums = result.scalars().all()
    
    return list(albums), total


async def search_albums(
    db: AsyncSession,
    search: str,
    skip: int = 0,
    limit: int = 50
) -> tuple[list[Album], int]:
    """Busca álbumes por título"""
    search_pattern = f"%{search}%"
    
    # Count
    count_query = select(func.count(Album.AlbumId)).where(
        Album.Title.ilike(search_pattern)
    )
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Data
    query = (
        select(Album)
        .options(selectinload(Album.artist))
        .where(Album.Title.ilike(search_pattern))
        .offset(skip)
        .limit(limit)
        .order_by(Album.Title)
    )
    result = await db.execute(query)
    albums = result.scalars().all()
    
    return list(albums), total