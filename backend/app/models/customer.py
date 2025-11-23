from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Customer(Base):
    __tablename__ = "Customer"
    
    CustomerId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    FirstName = Column(String(40), nullable=False)
    LastName = Column(String(20), nullable=False)
    Company = Column(String(80))
    Address = Column(String(70))
    City = Column(String(40))
    State = Column(String(40))
    Country = Column(String(40))
    PostalCode = Column(String(10))
    Phone = Column(String(24))
    Fax = Column(String(24))
    Email = Column(String(60), nullable=False, unique=True)
    SupportRepId = Column(Integer, ForeignKey("Employee.EmployeeId"))
    
    # Relación
    invoices = relationship("Invoice", back_populates="customer")