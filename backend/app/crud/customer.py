from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


async def get_customer(db: AsyncSession, customer_id: int) -> Customer | None:
    """Obtiene un cliente por ID"""
    result = await db.execute(
        select(Customer).where(Customer.CustomerId == customer_id)
    )
    return result.scalar_one_or_none()


async def get_customer_by_email(db: AsyncSession, email: str) -> Customer | None:
    """Obtiene un cliente por email"""
    result = await db.execute(
        select(Customer).where(Customer.Email == email)
    )
    return result.scalar_one_or_none()


async def get_customers(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    search: str | None = None,
) -> tuple[list[Customer], int]:
    """Obtiene lista de clientes con paginación y búsqueda opcional"""
    # Base query
    base_query = select(Customer)
    
    # Búsqueda por nombre, email o company
    if search:
        search_pattern = f"%{search}%"
        base_query = base_query.where(
            (Customer.FirstName.ilike(search_pattern)) |
            (Customer.LastName.ilike(search_pattern)) |
            (Customer.Email.ilike(search_pattern)) |
            (Customer.Company.ilike(search_pattern))
        )
    
    # Count
    count_query = select(func.count(Customer.CustomerId))
    if search:
        search_pattern = f"%{search}%"
        count_query = count_query.where(
            (Customer.FirstName.ilike(search_pattern)) |
            (Customer.LastName.ilike(search_pattern)) |
            (Customer.Email.ilike(search_pattern)) |
            (Customer.Company.ilike(search_pattern))
        )
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Data
    query = base_query.offset(skip).limit(limit).order_by(Customer.LastName, Customer.FirstName)
    result = await db.execute(query)
    customers = result.scalars().all()
    
    return list(customers), total


async def create_customer(db: AsyncSession, customer: CustomerCreate) -> Customer:
    """Crea un nuevo cliente"""
    db_customer = Customer(**customer.model_dump())
    db.add(db_customer)
    await db.commit()
    await db.refresh(db_customer)
    return db_customer


async def update_customer(
    db: AsyncSession,
    customer_id: int,
    customer_update: CustomerUpdate
) -> Customer | None:
    """Actualiza un cliente existente"""
    db_customer = await get_customer(db, customer_id)
    if not db_customer:
        return None
    
    # Actualizar solo los campos que vienen en el request
    update_data = customer_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_customer, field, value)
    
    await db.commit()
    await db.refresh(db_customer)
    return db_customer


async def delete_customer(db: AsyncSession, customer_id: int) -> bool:
    """Elimina un cliente"""
    db_customer = await get_customer(db, customer_id)
    if not db_customer:
        return False
    
    await db.delete(db_customer)
    await db.commit()
    return True