from sqlalchemy import Integer, String, Column, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.database import Base


class Track(Base):
    __tablename__ = "Track"
    
    TrackId = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(200), nullable=False)
    AlbumId = Column(Integer, ForeignKey("Album.AlbumId"))
    MediaTypeId = Column(Integer, ForeignKey("MediaType.MediaTypeId"), nullable=False)
    GenreId = Column(Integer, ForeignKey("Genre.GenreId"))
    Composer = Column(String(220))
    Milliseconds = Column(Integer, nullable=False)
    Bytes = Column(Integer)
    UnitPrice = Column(Numeric(10, 2), nullable=False)
    
    # Relationships
    album = relationship("Album", back_populates="tracks")
    media_type = relationship("MediaType")
    genre = relationship("Genre")
    invoice_lines = relationship("InvoiceLine", back_populates="track")
    playlists = relationship("PlaylistTrack", back_populates="track")