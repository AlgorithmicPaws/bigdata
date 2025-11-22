from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Purchase(Base):
    __tablename__ = "purchases"

    purchase_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.CustomerId"))
    employee_id = Column(Integer, ForeignKey("employees.EmployeeId"))
    billing_address = Column(String)

    items = relationship("PurchaseItem", back_populates="purchase")


class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    item_id = Column(Integer, primary_key=True, autoincrement=True)
    purchase_id = Column(Integer, ForeignKey("purchases.purchase_id"))
    track_id = Column(Integer, ForeignKey("tracks.TrackId"))
    unit_price = Column(Float)

    purchase = relationship("Purchase", back_populates="items")
    track = relationship("Track")


class Employee(Base):
    __tablename__ = "employees"

    EmployeeId = Column(Integer, primary_key=True, index=True)
    LastName = Column(String(50))
    FirstName = Column(String(50))
    Title = Column(String(100))
    ReportsTo = Column(Integer, ForeignKey("employees.EmployeeId"), nullable=True)

    subordinates = relationship("Employee")


class Customer(Base):
    __tablename__ = "customers"

    CustomerId = Column(Integer, primary_key=True, index=True)
    FirstName = Column(String(50))
    LastName = Column(String(50))
    Email = Column(String(120))
    Phone = Column(String(30), nullable=True)
    SupportRepId = Column(Integer, ForeignKey("employees.EmployeeId"), nullable=True)

    support_rep = relationship("Employee")


class Track(Base):
    __tablename__ = "tracks"

    TrackId = Column(Integer, primary_key=True, index=True)
    Name = Column(String(200))
    Composer = Column(String(200), nullable=True)
    UnitPrice = Column(Float)
