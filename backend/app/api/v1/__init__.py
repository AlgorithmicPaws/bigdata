from fastapi import APIRouter
from app.api.v1 import artists, albums, tracks, genres, customers, invoices

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(artists.router, prefix="/artists", tags=["Artists"])
api_router.include_router(albums.router, prefix="/albums", tags=["Albums"])
api_router.include_router(tracks.router, prefix="/tracks", tags=["Tracks"])
api_router.include_router(genres.router, prefix="/genres", tags=["Genres"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["Invoices"])