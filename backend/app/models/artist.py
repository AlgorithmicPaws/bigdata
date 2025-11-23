from sqlalchemy import Integer, String, Column
from sqlalchemy.orm import relationship
from app.database import Base


class Artist(Base):
    __tablename__ = "Artist"
    
    ArtistId = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(120))
    
    # Relationships
    albums = relationship("Album", back_populates="artist")