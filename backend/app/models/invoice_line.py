from sqlalchemy import Column, Integer, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class InvoiceLine(Base):
    __tablename__ = "InvoiceLine"
    
    InvoiceLineId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    InvoiceId = Column(Integer, ForeignKey("Invoice.InvoiceId"), nullable=False)
    TrackId = Column(Integer, ForeignKey("Track.TrackId"), nullable=False)
    UnitPrice = Column(DECIMAL(10, 2), nullable=False)
    Quantity = Column(Integer, nullable=False)
    
    # Relaciones
    invoice = relationship("Invoice", back_populates="lines")
    track = relationship("Track")