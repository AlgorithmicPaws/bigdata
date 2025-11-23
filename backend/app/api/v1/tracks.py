from fastapi import APIRouter, HTTPException, Query
from app.api.deps import DBSession
from app.schemas import track as schemas
from app.crud import track as crud

router = APIRouter()


@router.get("/", response_model=schemas.TrackList)
async def list_tracks(
    db: DBSession,
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(50, ge=1, le=100, description="Items por página"),
    album_id: int | None = Query(None, description="Filtrar por álbum"),
    genre_id: int | None = Query(None, description="Filtrar por género"),
    search: str | None = Query(None, description="Buscar por nombre")
):
    """Lista todos los tracks con paginación, filtros y búsqueda"""
    skip = (page - 1) * page_size
    
    if search:
        tracks, total = await crud.search_tracks(db, search, skip, page_size)
    else:
        tracks, total = await crud.get_tracks(db, skip, page_size, album_id, genre_id)
    
    # Enriquecer con nombres de artista y género
    tracks_detail = []
    for track in tracks:
        track_dict = schemas.TrackDetail.model_validate(track).model_dump()
        
        # Agregar nombre del artista
        if track.album and track.album.artist:
            track_dict["artist_name"] = track.album.artist.Name
        
        # Agregar nombre del género
        if track.genre:
            track_dict["genre_name"] = track.genre.Name
        
        tracks_detail.append(schemas.TrackDetail(**track_dict))
    
    return schemas.TrackList(
        tracks=tracks_detail,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{track_id}", response_model=schemas.TrackDetail)
async def get_track(track_id: int, db: DBSession):
    """Obtiene un track por ID con todas sus relaciones"""
    track = await crud.get_track(db, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="Track no encontrado")
    
    # Enriquecer con nombres
    track_dict = schemas.TrackDetail.model_validate(track).model_dump()
    
    if track.album and track.album.artist:
        track_dict["artist_name"] = track.album.artist.Name
    
    if track.genre:
        track_dict["genre_name"] = track.genre.Name
    
    return schemas.TrackDetail(**track_dict)