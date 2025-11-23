from pydantic import BaseModel, EmailStr, ConfigDict


class CustomerBase(BaseModel):
    """Schema base para Customer"""
    FirstName: str
    LastName: str
    Company: str | None = None
    Address: str | None = None
    City: str | None = None
    State: str | None = None
    Country: str | None = None
    PostalCode: str | None = None
    Phone: str | None = None
    Fax: str | None = None
    Email: EmailStr
    SupportRepId: int | None = None


class CustomerCreate(CustomerBase):
    """Schema para crear un cliente"""
    pass


class CustomerUpdate(BaseModel):
    """Schema para actualizar un cliente (todos los campos opcionales)"""
    FirstName: str | None = None
    LastName: str | None = None
    Company: str | None = None
    Address: str | None = None
    City: str | None = None
    State: str | None = None
    Country: str | None = None
    PostalCode: str | None = None
    Phone: str | None = None
    Fax: str | None = None
    Email: EmailStr | None = None
    SupportRepId: int | None = None


class Customer(CustomerBase):
    """Schema de respuesta de Customer"""
    CustomerId: int
    
    model_config = ConfigDict(from_attributes=True)


class CustomerList(BaseModel):
    """Schema para lista de clientes con paginación"""
    customers: list[Customer]
    total: int
    page: int
    page_size: int