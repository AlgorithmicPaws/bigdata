from pydantic import BaseModel, ConfigDict


class GenreBase(BaseModel):
    """Schema base para Genre"""
    Name: str | None = None


class Genre(GenreBase):
    """Schema para respuesta de Genre"""
    GenreId: int
    
    model_config = ConfigDict(from_attributes=True)


class GenreList(BaseModel):
    """Schema para lista de géneros"""
    genres: list[Genre]
    total: int