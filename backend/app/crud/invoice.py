from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from datetime import datetime
from decimal import Decimal

from app.models import Invoice, InvoiceLine, Track, Album, Artist, Customer, Employee
from app.schemas.invoice import InvoiceCreate


async def get_invoice(db: AsyncSession, invoice_id: int) -> Invoice | None:
    """Obtiene una factura por ID con sus items"""
    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.lines))
        .where(Invoice.InvoiceId == invoice_id)
    )
    return result.scalar_one_or_none()


async def get_invoices(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    customer_id: int | None = None,
    employee_id: int | None = None,
) -> tuple[list[Invoice], int]:
    """Obtiene lista de facturas con paginación y filtros opcionales"""
    base_query = select(Invoice)
    
    # Filtros opcionales
    if customer_id:
        base_query = base_query.where(Invoice.CustomerId == customer_id)
    if employee_id:
        base_query = base_query.where(Invoice.EmployeeId == employee_id)
    
    # Count
    count_query = select(func.count(Invoice.InvoiceId))
    if customer_id:
        count_query = count_query.where(Invoice.CustomerId == customer_id)
    if employee_id:
        count_query = count_query.where(Invoice.EmployeeId == employee_id)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Data
    query = base_query.offset(skip).limit(limit).order_by(Invoice.InvoiceDate.desc())
    result = await db.execute(query)
    invoices = result.scalars().all()
    
    return list(invoices), total


async def create_invoice(
    db: AsyncSession,
    invoice_data: InvoiceCreate
) -> Invoice:
    """Crea una nueva factura con sus items"""
    # Calcular total
    total = Decimal('0.00')
    invoice_items = []
    
    for item in invoice_data.items:
        # Obtener precio del track
        track_result = await db.execute(
            select(Track).where(Track.TrackId == item.TrackId)
        )
        track = track_result.scalar_one_or_none()
        if not track:
            raise ValueError(f"Track {item.TrackId} no encontrado")
        
        item_total = track.UnitPrice * item.Quantity
        total += item_total
        
        invoice_items.append({
            "TrackId": item.TrackId,
            "UnitPrice": track.UnitPrice,
            "Quantity": item.Quantity
        })
    
    # Crear la factura
    db_invoice = Invoice(
        CustomerId=invoice_data.CustomerId,
        InvoiceDate=datetime.now(),
        BillingAddress=invoice_data.BillingAddress,
        BillingCity=invoice_data.BillingCity,
        BillingState=invoice_data.BillingState,
        BillingCountry=invoice_data.BillingCountry,
        BillingPostalCode=invoice_data.BillingPostalCode,
        Total=total,
        EmployeeId=invoice_data.EmployeeId
    )
    
    db.add(db_invoice)
    await db.flush()  # Para obtener el InvoiceId
    
    # Crear los items
    for item_data in invoice_items:
        invoice_line = InvoiceLine(
            InvoiceId=db_invoice.InvoiceId,
            **item_data
        )
        db.add(invoice_line)
    
    await db.commit()
    await db.refresh(db_invoice)
    
    # Cargar los items
    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.lines))
        .where(Invoice.InvoiceId == db_invoice.InvoiceId)
    )
    return result.scalar_one()


async def get_invoice_detail(db: AsyncSession, invoice_id: int) -> dict | None:
    """Obtiene detalle completo de una factura con información relacionada"""
    # Obtener factura
    invoice = await get_invoice(db, invoice_id)
    if not invoice:
        return None
    
    # Obtener información del cliente
    customer_result = await db.execute(
        select(Customer).where(Customer.CustomerId == invoice.CustomerId)
    )
    customer = customer_result.scalar_one_or_none()
    
    # Obtener información del empleado si existe
    employee = None
    if invoice.EmployeeId:
        employee_result = await db.execute(
            select(Employee).where(Employee.EmployeeId == invoice.EmployeeId)
        )
        employee = employee_result.scalar_one_or_none()
    
    # Obtener detalles de los items
    items_detail = []
    for line in invoice.lines:
        # Obtener track con album y artist
        track_result = await db.execute(
            select(Track)
            .options(selectinload(Track.album).selectinload(Album.artist))
            .where(Track.TrackId == line.TrackId)
        )
        track = track_result.scalar_one_or_none()
        
        item_detail = {
            "InvoiceLineId": line.InvoiceLineId,
            "InvoiceId": line.InvoiceId,
            "TrackId": line.TrackId,
            "UnitPrice": line.UnitPrice,
            "Quantity": line.Quantity,
            "track_name": track.Name if track else None,
            "album_title": track.album.Title if track and track.album else None,
            "artist_name": track.album.artist.Name if track and track.album and track.album.artist else None,
        }
        items_detail.append(item_detail)
    
    return {
        **invoice.__dict__,
        "items": items_detail,
        "customer_name": f"{customer.FirstName} {customer.LastName}" if customer else None,
        "employee_name": f"{employee.FirstName} {employee.LastName}" if employee else None,
    }


async def get_customer_purchase_history(
    db: AsyncSession,
    customer_id: int,
    skip: int = 0,
    limit: int = 50
) -> tuple[list[Invoice], int]:
    """Obtiene historial de compras de un cliente"""
    return await get_invoices(db, skip, limit, customer_id=customer_id)