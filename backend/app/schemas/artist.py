from pydantic import BaseModel, ConfigDict


class ArtistBase(BaseModel):
    """Schema base para Artist"""
    Name: str | None = None


class Artist(ArtistBase):
    """Schema para respuesta de Artist"""
    ArtistId: int
    
    model_config = ConfigDict(from_attributes=True)


class ArtistList(BaseModel):
    """Schema para lista de artistas con paginación"""
    artists: list[Artist]
    total: int
    page: int
    page_size: int
    
    model_config = ConfigDict(from_attributes=True)