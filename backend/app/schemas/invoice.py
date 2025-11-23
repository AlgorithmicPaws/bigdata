from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from decimal import Decimal


class InvoiceItemCreate(BaseModel):
    """Schema para crear un item de factura"""
    TrackId: int
    Quantity: int = 1
    
    @field_validator('Quantity')
    @classmethod
    def validate_quantity(cls, v):
        if v < 1:
            raise ValueError('La cantidad debe ser mayor a 0')
        return v


class InvoiceItem(BaseModel):
    """Schema de respuesta de InvoiceItem"""
    InvoiceLineId: int
    InvoiceId: int
    TrackId: int
    UnitPrice: Decimal
    Quantity: int
    
    model_config = ConfigDict(from_attributes=True)


class InvoiceItemDetail(InvoiceItem):
    """Schema detallado de InvoiceItem con información del track"""
    track_name: str | None = None
    artist_name: str | None = None
    album_title: str | None = None


class InvoiceCreate(BaseModel):
    """Schema para crear una factura"""
    CustomerId: int
    EmployeeId: int | None = None  # Opcional - para ventas asistidas
    BillingAddress: str | None = None
    BillingCity: str | None = None
    BillingState: str | None = None
    BillingCountry: str | None = None
    BillingPostalCode: str | None = None
    items: list[InvoiceItemCreate]
    
    @field_validator('items')
    @classmethod
    def validate_items(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Debe incluir al menos un item')
        return v


class Invoice(BaseModel):
    """Schema de respuesta de Invoice"""
    InvoiceId: int
    CustomerId: int
    InvoiceDate: datetime
    BillingAddress: str | None = None
    BillingCity: str | None = None
    BillingState: str | None = None
    BillingCountry: str | None = None
    BillingPostalCode: str | None = None
    Total: Decimal
    EmployeeId: int | None = None
    
    model_config = ConfigDict(from_attributes=True)


class InvoiceDetail(Invoice):
    """Schema detallado de Invoice con items"""
    items: list[InvoiceItemDetail] = []
    customer_name: str | None = None
    employee_name: str | None = None


class InvoiceList(BaseModel):
    """Schema para lista de facturas con paginación"""
    invoices: list[Invoice]
    total: int
    page: int
    page_size: int