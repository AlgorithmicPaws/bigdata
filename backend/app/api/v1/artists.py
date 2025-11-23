from fastapi import APIRouter, HTTPException, Query
from app.api.deps import DBSession
from app.schemas import artist as schemas
from app.crud import artist as crud

router = APIRouter()


@router.get("/", response_model=schemas.ArtistList)
async def list_artists(
    db: DBSession,
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(50, ge=1, le=100, description="Items por página"),
    search: str | None = Query(None, description="Buscar por nombre")
):
    """Lista todos los artistas con paginación y búsqueda opcional"""
    skip = (page - 1) * page_size
    
    if search:
        artists, total = await crud.search_artists(db, search, skip, page_size)
    else:
        artists, total = await crud.get_artists(db, skip, page_size)
    
    return schemas.ArtistList(
        artists=artists,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{artist_id}", response_model=schemas.Artist)
async def get_artist(artist_id: int, db: DBSession):
    """Obtiene un artista por ID"""
    artist = await crud.get_artist(db, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    return artist