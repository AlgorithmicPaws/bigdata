from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# -----------------------------
# TRACK SCHEMAS
# -----------------------------

class TrackBase(BaseModel):
    Name: str
    Composer: Optional[str] = None
    UnitPrice: float


class TrackCreate(TrackBase):
    pass


class TrackOut(TrackBase):
    TrackId: int

    class Config:
        orm_mode = True


# -----------------------------
# CUSTOMER SCHEMAS
# -----------------------------

class CustomerBase(BaseModel):
    FirstName: str
    LastName: str
    Email: str
    Phone: Optional[str] = None
    SupportRepId: Optional[int] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerOut(CustomerBase):
    CustomerId: int

    class Config:
        orm_mode = True


# -----------------------------
# PURCHASE SCHEMAS
# -----------------------------

class PurchaseIn(BaseModel):
    customer_id: int
    employee_id: Optional[int] = None
    billing_address: Optional[str] = None
    track_ids: List[int]


class PurchaseItemOut(BaseModel):
    item_id: int
    track_id: int
    unit_price: float

    class Config:
        orm_mode = True


class PurchaseOut(BaseModel):
    PurchaseId: int
    customer_id: int
    employee_id: Optional[int]
    billing_address: Optional[str]
    items: List[PurchaseItemOut]

    class Config:
        orm_mode = True


# -----------------------------
# CUSTOMER HISTORY SCHEMAS
# -----------------------------

class CustomerHistoryItem(BaseModel):
    PurchaseId: int
    invoice_date: datetime
    total: float
    employee_id: Optional[int]

    class Config:
        orm_mode = True
