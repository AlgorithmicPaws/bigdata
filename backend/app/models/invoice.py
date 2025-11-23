from sqlalchemy import Column, Integer, String, DateTime, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Invoice(Base):
    __tablename__ = "Invoice"
    
    InvoiceId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    CustomerId = Column(Integer, ForeignKey("Customer.CustomerId"), nullable=False)
    InvoiceDate = Column(DateTime, nullable=False)
    BillingAddress = Column(String(70))
    BillingCity = Column(String(40))
    BillingState = Column(String(40))
    BillingCountry = Column(String(40))
    BillingPostalCode = Column(String(10))
    Total = Column(DECIMAL(10, 2), nullable=False)
    EmployeeId = Column(Integer, ForeignKey("Employee.EmployeeId"), nullable=True)
    
    # Relaciones
    lines = relationship("InvoiceLine", back_populates="invoice", lazy="select")
    customer = relationship("Customer", back_populates="invoices")
    employee = relationship("Employee", back_populates="invoices")