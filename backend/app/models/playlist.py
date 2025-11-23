from sqlalchemy import Integer, String, Column
from sqlalchemy.orm import relationship
from app.database import Base


class Playlist(Base):
    __tablename__ = "Playlist"
    
    PlaylistId = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(120))
    
    # Relationships
    tracks = relationship("PlaylistTrack", back_populates="playlist")