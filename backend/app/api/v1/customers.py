from fastapi import APIRouter, HTTPException, Query, status
from app.api.deps import DBSession
from app.schemas import customer as schemas
from app.crud import customer as crud

router = APIRouter()


@router.get("/", response_model=schemas.CustomerList)
async def list_customers(
    db: DBSession,
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(50, ge=1, le=100, description="Items por página"),
    search: str | None = Query(None, description="Buscar por nombre, email o compañía")
):
    """Lista todos los clientes con paginación y búsqueda opcional"""
    skip = (page - 1) * page_size
    customers, total = await crud.get_customers(db, skip, page_size, search)
    
    return schemas.CustomerList(
        customers=customers,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{customer_id}", response_model=schemas.Customer)
async def get_customer(customer_id: int, db: DBSession):
    """Obtiene un cliente por ID"""
    customer = await crud.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    return customer


@router.post("/", response_model=schemas.Customer, status_code=status.HTTP_201_CREATED)
async def create_customer(customer: schemas.CustomerCreate, db: DBSession):
    """Crea un nuevo cliente"""
    # Verificar si el email ya existe
    existing_customer = await crud.get_customer_by_email(db, customer.Email)
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un cliente con este email"
        )
    
    # Verificar que el SupportRepId existe si se proporciona
    if customer.SupportRepId:
        from app.crud import employee
        support_rep = await employee.get_employee(db, customer.SupportRepId)
        if not support_rep:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="El empleado de soporte especificado no existe"
            )
    
    return await crud.create_customer(db, customer)


@router.put("/{customer_id}", response_model=schemas.Customer)
async def update_customer(
    customer_id: int,
    customer_update: schemas.CustomerUpdate,
    db: DBSession
):
    """Actualiza un cliente existente"""
    # Verificar si el email ya está en uso por otro cliente
    if customer_update.Email:
        existing_customer = await crud.get_customer_by_email(db, customer_update.Email)
        if existing_customer and existing_customer.CustomerId != customer_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe otro cliente con este email"
            )
    
    # Verificar que el SupportRepId existe si se proporciona
    if customer_update.SupportRepId:
        from app.crud import employee
        support_rep = await employee.get_employee(db, customer_update.SupportRepId)
        if not support_rep:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="El empleado de soporte especificado no existe"
            )
    
    customer = await crud.update_customer(db, customer_id, customer_update)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(customer_id: int, db: DBSession):
    """Elimina un cliente"""
    success = await crud.delete_customer(db, customer_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    return None