from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.models import Track, Album


async def get_track(db: AsyncSession, track_id: int) -> Track | None:
    """Obtiene un track por ID con todas sus relaciones"""
    result = await db.execute(
        select(Track)
        .options(
            selectinload(Track.album).selectinload(Album.artist),
            selectinload(Track.genre),
            selectinload(Track.media_type),
        )
        .where(Track.TrackId == track_id)
    )
    return result.scalar_one_or_none()


async def get_tracks(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    album_id: int | None = None,
    genre_id: int | None = None
) -> tuple[list[Track], int]:
    """Obtiene lista de tracks con paginación y filtros"""
    # Base query
    base_query = select(Track).options(
        selectinload(Track.album).selectinload(Album.artist),
        selectinload(Track.genre),
    )
    
    # Filtros opcionales
    if album_id:
        base_query = base_query.where(Track.AlbumId == album_id)
    if genre_id:
        base_query = base_query.where(Track.GenreId == genre_id)
    
    # Count
    count_query = select(func.count(Track.TrackId))
    if album_id:
        count_query = count_query.where(Track.AlbumId == album_id)
    if genre_id:
        count_query = count_query.where(Track.GenreId == genre_id)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Data
    query = base_query.offset(skip).limit(limit).order_by(Track.Name)
    result = await db.execute(query)
    tracks = result.scalars().all()
    
    return list(tracks), total


async def search_tracks(
    db: AsyncSession,
    search: str,
    skip: int = 0,
    limit: int = 50
) -> tuple[list[Track], int]:
    """Busca tracks por nombre"""
    search_pattern = f"%{search}%"
    
    # Count
    count_query = select(func.count(Track.TrackId)).where(
        Track.Name.ilike(search_pattern)
    )
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Data
    query = (
        select(Track)
        .options(
            selectinload(Track.album).selectinload(Album.artist),
            selectinload(Track.genre),
        )
        .where(Track.Name.ilike(search_pattern))
        .offset(skip)
        .limit(limit)
        .order_by(Track.Name)
    )
    result = await db.execute(query)
    tracks = result.scalars().all()
    
    return list(tracks), total