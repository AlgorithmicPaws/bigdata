from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Employee(Base):
    __tablename__ = "Employee"
    
    EmployeeId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    LastName = Column(String(20), nullable=False)
    FirstName = Column(String(20), nullable=False)
    Title = Column(String(30))
    ReportsTo = Column(Integer, ForeignKey("Employee.EmployeeId"))
    BirthDate = Column(DateTime)
    HireDate = Column(DateTime)
    Address = Column(String(70))
    City = Column(String(40))
    State = Column(String(40))
    Country = Column(String(40))
    PostalCode = Column(String(10))
    Phone = Column(String(24))
    Fax = Column(String(24))
    Email = Column(String(60))
    
    # Relación
    invoices = relationship("Invoice", back_populates="employee")