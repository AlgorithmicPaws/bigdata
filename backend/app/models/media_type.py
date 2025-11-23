from sqlalchemy import Integer, String, Column
from app.database import Base


class MediaType(Base):
    __tablename__ = "MediaType"
    
    MediaTypeId = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(120))