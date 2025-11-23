from sqlalchemy import Integer, Column, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class PlaylistTrack(Base):
    __tablename__ = "PlaylistTrack"
    
    PlaylistId = Column(Integer, ForeignKey("Playlist.PlaylistId"), primary_key=True)
    TrackId = Column(Integer, ForeignKey("Track.TrackId"), primary_key=True)
    
    # Relationships
    playlist = relationship("Playlist", back_populates="tracks")
    track = relationship("Track", back_populates="playlists")