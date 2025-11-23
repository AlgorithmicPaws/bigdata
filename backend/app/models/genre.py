from sqlalchemy import Integer, String, Column
from app.database import Base


class Genre(Base):
    __tablename__ = "Genre"
    
    GenreId = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(120))