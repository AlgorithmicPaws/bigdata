from fastapi import APIRouter, HTTPException, Query, status
from app.api.deps import DBSession
from app.schemas import invoice as schemas
from app.crud import invoice as crud, customer as customer_crud, employee as employee_crud

router = APIRouter()


@router.get("/", response_model=schemas.InvoiceList)
async def list_invoices(
    db: DBSession,
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(50, ge=1, le=100, description="Items por página"),
    customer_id: int | None = Query(None, description="Filtrar por cliente"),
    employee_id: int | None = Query(None, description="Filtrar por empleado")
):
    """Lista todas las facturas con paginación y filtros opcionales"""
    skip = (page - 1) * page_size
    invoices, total = await crud.get_invoices(db, skip, page_size, customer_id, employee_id)
    
    return schemas.InvoiceList(
        invoices=invoices,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{invoice_id}", response_model=schemas.InvoiceDetail)
async def get_invoice(invoice_id: int, db: DBSession):
    """Obtiene una factura por ID con todos sus detalles"""
    invoice = await crud.get_invoice_detail(db, invoice_id)
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Factura no encontrada"
        )
    return invoice


@router.post("/", response_model=schemas.InvoiceDetail, status_code=status.HTTP_201_CREATED)
async def create_invoice(invoice: schemas.InvoiceCreate, db: DBSession):
    """Crea una nueva factura"""
    # Verificar que el cliente existe
    customer = await customer_crud.get_customer(db, invoice.CustomerId)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    # Verificar que el empleado existe si se proporciona
    if invoice.EmployeeId:
        employee = await employee_crud.get_employee(db, invoice.EmployeeId)
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empleado no encontrado"
            )
    
    try:
        created_invoice = await crud.create_invoice(db, invoice)
        # Obtener detalle completo
        invoice_detail = await crud.get_invoice_detail(db, created_invoice.InvoiceId)
        return invoice_detail
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/customer/{customer_id}/history", response_model=schemas.InvoiceList)
async def get_customer_purchase_history(
    customer_id: int,
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100)
):
    """Obtiene historial de compras de un cliente"""
    # Verificar que el cliente existe
    customer = await customer_crud.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    skip = (page - 1) * page_size
    invoices, total = await crud.get_customer_purchase_history(db, customer_id, skip, page_size)
    
    return schemas.InvoiceList(
        invoices=invoices,
        total=total,
        page=page,
        page_size=page_size
    )