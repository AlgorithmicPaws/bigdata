from fastapi import APIRouter, HTTPException
from app.api.deps import DBSession
from app.schemas import genre as schemas
from app.crud import genre as crud

router = APIRouter()


@router.get("/", response_model=schemas.GenreList)
async def list_genres(db: DBSession):
    """Lista todos los géneros musicales"""
    genres, total = await crud.get_genres(db)
    
    return schemas.GenreList(
        genres=genres,
        total=total
    )


@router.get("/{genre_id}", response_model=schemas.Genre)
async def get_genre(genre_id: int, db: DBSession):
    """Obtiene un género por ID"""
    genre = await crud.get_genre(db, genre_id)
    if not genre:
        raise HTTPException(status_code=404, detail="Género no encontrado")
    return genre