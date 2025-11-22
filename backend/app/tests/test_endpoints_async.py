# backend/tests/test_endpoints_async.py
import pytest
from sqlalchemy import insert
from app import models
from decimal import Decimal

@pytest.mark.asyncio
async def test_buy_tracks_and_history(client, db_session):
    # crear datos base: customer, employee, track
    await db_session.execute(insert(models.Customer).values(CustomerId=1, FirstName="Juan", LastName="Perez"))
    await db_session.execute(insert(models.Employee).values(EmployeeId=1, FirstName="Ana", LastName="Lopez"))
    await db_session.execute(insert(models.Track).values(TrackId=10, Name="Song A", UnitPrice=Decimal("0.99")))
    await db_session.commit()

    # comprar track con empleado
    payload = {
        "customer_id": 1,
        "track_ids": [10],
        "billing_address": "Calle 1",
        "employee_id": 1
    }
    r = await client.post("/purchases/", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data["customer_id"] == 1
    assert data["employee_id"] == 1
    assert float(data["total"]) == 0.99

    # consultar historial
    r2 = await client.get("/purchases/customer/1/history")
    assert r2.status_code == 200
    hist = r2.json()
    assert len(hist) >= 1
    assert hist[0]["employee_id"] == 1
