from fastapi import APIRouter, HTTPException, Query
from app.api.deps import DBSession
from app.schemas import album as schemas
from app.crud import album as crud

router = APIRouter()


@router.get("/", response_model=schemas.AlbumList)
async def list_albums(
    db: DBSession,
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(50, ge=1, le=100, description="Items por página"),
    artist_id: int | None = Query(None, description="Filtrar por artista"),
    search: str | None = Query(None, description="Buscar por título")
):
    """Lista todos los álbumes con paginación, filtros y búsqueda"""
    skip = (page - 1) * page_size
    
    if search:
        albums, total = await crud.search_albums(db, search, skip, page_size)
    else:
        albums, total = await crud.get_albums(db, skip, page_size, artist_id)
    
    return schemas.AlbumList(
        albums=albums,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{album_id}", response_model=schemas.AlbumDetail)
async def get_album(album_id: int, db: DBSession):
    """Obtiene un álbum por ID con su artista"""
    album = await crud.get_album(db, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Álbum no encontrado")
    return album