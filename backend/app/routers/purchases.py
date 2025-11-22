from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import models

router = APIRouter(prefix="/purchases", tags=["purchases"])


@router.post("/", status_code=201)
async def register_purchase(payload: dict, db: AsyncSession = Depends(get_db)):
    customer_id = payload["customer_id"]
    track_ids = payload["track_ids"]
    billing_address = payload["billing_address"]
    employee_id = payload.get("employee_id")

    purchase = models.Purchase(
        customer_id=customer_id,
        employee_id=employee_id,
        billing_address=billing_address
    )
    db.add(purchase)
    await db.flush()  # obtener purchase_id

    total = 0

    for t_id in track_ids:
        track = await db.get(models.Track, t_id)
        if not track:
            raise HTTPException(status_code=404, detail="Track not found")
        
        total += track.UnitPrice

        item = models.PurchaseItem(
            purchase_id=purchase.purchase_id,
            track_id=t_id,
            unit_price=track.UnitPrice
        )
        db.add(item)

    await db.commit()
    await db.refresh(purchase)

    return {
        "purchase_id": purchase.purchase_id,
        "customer_id": purchase.customer_id,
        "employee_id": purchase.employee_id,
        "billing_address": purchase.billing_address,
        "total": float(total)
    }


@router.get("/customer/{customer_id}/history")
async def get_history(customer_id: int, db: AsyncSession = Depends(get_db)):
    q = await db.execute(
        select(models.Purchase).where(models.Purchase.customer_id == customer_id)
    )
    purchases = q.scalars().all()

    result = []
    for p in purchases:
        result.append({
            "purchase_id": p.purchase_id,
            "customer_id": p.customer_id,
            "employee_id": p.employee_id,
            "billing_address": p.billing_address
        })

    return result
