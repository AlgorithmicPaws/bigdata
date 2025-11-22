
# app/crud.py
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas
from decimal import Decimal
from datetime import datetime

async def list_tracks(db: AsyncSession, limit: int = 100):
    q = await db.execute(select(models.Track).limit(limit))
    return q.scalars().all()

async def get_track(db: AsyncSession, track_id: int):
    q = await db.execute(select(models.Track).where(models.Track.TrackId == track_id))
    return q.scalar_one_or_none()

async def create_invoice(db: AsyncSession, customer_id: int, track_ids: list[int], billing_address: str | None, employee_id: int | None):
    # calcula total sumando precios
    tracks = []
    total = Decimal("0.00")
    for tid in track_ids:
        t = await get_track(db, tid)
        if not t:
            raise ValueError(f"Track {tid} not found")
        tracks.append(t)
        total += Decimal(str(t.UnitPrice))

    # crear Invoice
    invoice = models.Invoice(
        CustomerId=customer_id,
        InvoiceDate=datetime.utcnow(),
        BillingAddress=billing_address,
        Total=total,
        EmployeeId=employee_id
    )
    db.add(invoice)
    await db.flush()  # para obtener invoice.InvoiceId

    # crear InvoiceLine(s) si quieres mantener integridad con Chinook
    # suponiendo tabla InvoiceLine tiene campos InvoiceLineId, InvoiceId, TrackId, UnitPrice, Quantity
    for t in tracks:
        await db.execute(
            insert(models.__table__.metadata.tables["InvoiceLine"]).values(
                InvoiceId=invoice.InvoiceId,
                TrackId=t.TrackId,
                UnitPrice=t.UnitPrice,
                Quantity=1
            )
        )

    await db.commit()
    await db.refresh(invoice)
    return invoice

async def get_customer_history(db: AsyncSession, customer_id: int):
    q = await db.execute(
        select(models.Invoice).where(models.Invoice.CustomerId == customer_id).order_by(models.Invoice.InvoiceDate.desc())
    )
    return q.scalars().all()
