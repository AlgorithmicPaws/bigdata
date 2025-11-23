from app.schemas.artist import Artist, ArtistList
from app.schemas.album import Album, AlbumList, AlbumDetail
from app.schemas.track import Track, TrackList, TrackDetail
from app.schemas.genre import Genre, GenreList
from app.schemas.customer import (
    Customer,
    CustomerCreate,
    CustomerUpdate,
    CustomerList,
)
from app.schemas.invoice import (
    Invoice,
    InvoiceCreate,
    InvoiceDetail,
    InvoiceList,
    InvoiceItem,
    InvoiceItemDetail,
    InvoiceItemCreate,
)

__all__ = [
    "Artist",
    "ArtistList",
    "Album",
    "AlbumList",
    "AlbumDetail",
    "Track",
    "TrackList",
    "TrackDetail",
    "Genre",
    "GenreList",
    "Customer",
    "CustomerCreate",
    "CustomerUpdate",
    "CustomerList",
    "Invoice",
    "InvoiceCreate",
    "InvoiceDetail",
    "InvoiceList",
    "InvoiceItem",
    "InvoiceItemDetail",
    "InvoiceItemCreate",
]