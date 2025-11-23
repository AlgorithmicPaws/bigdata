from pydantic import BaseModel, ConfigDict
from app.schemas.artist import Artist


class AlbumBase(BaseModel):
    """Schema base para Album"""
    Title: str
    ArtistId: int


class Album(AlbumBase):
    """Schema simple de Album"""
    AlbumId: int
    
    model_config = ConfigDict(from_attributes=True)


class AlbumDetail(Album):
    """Schema de Album con relaciones"""
    artist: Artist | None = None
    
    model_config = ConfigDict(from_attributes=True)


class AlbumList(BaseModel):
    """Schema para lista de álbumes con paginación"""
    albums: list[AlbumDetail]
    total: int
    page: int
    page_size: int