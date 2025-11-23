from sqlalchemy import Integer, String, Column, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Album(Base):
    __tablename__ = "Album"
    
    AlbumId = Column(Integer, primary_key=True, autoincrement=True)
    Title = Column(String(160), nullable=False)
    ArtistId = Column(Integer, ForeignKey("Artist.ArtistId"), nullable=False)
    
    # Relationships
    artist = relationship("Artist", back_populates="albums")
    tracks = relationship("Track", back_populates="album")