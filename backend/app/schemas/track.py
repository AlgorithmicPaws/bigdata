from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from app.schemas.album import Album
from app.schemas.artist import Artist


class TrackBase(BaseModel):
    """Schema base para Track"""
    Name: str
    Composer: str | None = None
    Milliseconds: int
    UnitPrice: Decimal


class Track(TrackBase):
    """Schema simple de Track"""
    TrackId: int
    AlbumId: int | None = None
    GenreId: int | None = None
    MediaTypeId: int
    
    model_config = ConfigDict(from_attributes=True)


class TrackDetail(Track):
    """Schema de Track con relaciones completas"""
    album: Album | None = None
    artist_name: str | None = None  # Nombre del artista (computed)
    genre_name: str | None = None   # Nombre del género (computed)
    
    model_config = ConfigDict(from_attributes=True)


class TrackList(BaseModel):
    """Schema para lista de tracks con paginación"""
    tracks: list[TrackDetail]
    total: int
    page: int
    page_size: int