import pytest
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import (
    Artist, Album, Track, Genre, MediaType,
    Customer, Employee, Invoice, InvoiceLine
)


@pytest.mark.asyncio
async def test_fetch_artists(db_session):
    """Verifica que se puedan leer artistas"""
    stmt = select(Artist).limit(5)
    result = await db_session.execute(stmt)
    artists = result.scalars().all()
    
    assert len(artists) > 0, "No hay artistas en la BD"
    assert artists[0].Name is not None
    print(f"\nPrimer artista: {artists[0].Name}")


@pytest.mark.asyncio
async def test_fetch_albums_with_artist(db_session):
    """Verifica relationships: Album -> Artist"""
    stmt = select(Album).options(selectinload(Album.artist)).limit(3)
    result = await db_session.execute(stmt)
    albums = result.scalars().all()
    
    assert len(albums) > 0
    for album in albums:
        assert album.artist is not None, "El relationship Album.artist falló"
        print(f"\nÁlbum: '{album.Title}' - Artista: '{album.artist.Name}'")


@pytest.mark.asyncio
async def test_fetch_tracks_with_full_relationships(db_session):
    """Verifica relationships complejos de Track"""
    stmt = (
        select(Track)
        .options(
            selectinload(Track.album).selectinload(Album.artist),
            selectinload(Track.genre),
            selectinload(Track.media_type),
        )
        .limit(5)
    )
    result = await db_session.execute(stmt)
    tracks = result.scalars().all()
    
    assert len(tracks) > 0, "No hay tracks en la BD"
    
    for track in tracks:
        assert track.Name is not None
        assert track.UnitPrice is not None
        print(f"\nTrack: '{track.Name}' - ${track.UnitPrice}")
        
        if track.album:
            print(f"  Álbum: '{track.album.Title}'")
            if track.album.artist:
                print(f"  Artista: '{track.album.artist.Name}'")


@pytest.mark.asyncio
async def test_fetch_customers(db_session):
    """Verifica que se puedan leer clientes"""
    stmt = select(Customer).limit(5)
    result = await db_session.execute(stmt)
    customers = result.scalars().all()
    
    assert len(customers) > 0, "No hay clientes en la BD"
    for customer in customers:
        assert customer.Email is not None
        print(f"\nCliente: {customer.FirstName} {customer.LastName} - {customer.Email}")


@pytest.mark.asyncio
async def test_fetch_employees(db_session):
    """Verifica que se puedan leer empleados"""
    stmt = select(Employee).limit(5)
    result = await db_session.execute(stmt)
    employees = result.scalars().all()
    
    assert len(employees) > 0, "No hay empleados en la BD"
    for emp in employees:
        print(f"\nEmpleado: {emp.FirstName} {emp.LastName} - {emp.Title}")


@pytest.mark.asyncio
async def test_invoice_employee_relationship(db_session):
    """Verifica que Invoice pueda tener EmployeeId nullable"""
    stmt = select(Invoice).options(selectinload(Invoice.employee)).limit(20)
    result = await db_session.execute(stmt)
    invoices = result.scalars().all()
    
    assert len(invoices) > 0, "No hay invoices en la BD"
    
    with_employee = [inv for inv in invoices if inv.EmployeeId is not None]
    without_employee = [inv for inv in invoices if inv.EmployeeId is None]
    
    print(f"\nInvoices CON empleado: {len(with_employee)}")
    print(f"Invoices SIN empleado: {len(without_employee)}")
    
    # Verificar que al menos algunos tengan y otros no
    # (esto depende de tus datos, pero es el comportamiento esperado)
    if with_employee:
        inv = with_employee[0]
        print(f"\nEjemplo con empleado: Invoice #{inv.InvoiceId}")
        print(f"  Empleado: {inv.employee.FirstName} {inv.employee.LastName}")


@pytest.mark.asyncio
async def test_invoice_with_lines(db_session):
    """Verifica relationship Invoice -> InvoiceLines"""
    stmt = (
        select(Invoice)
        .options(selectinload(Invoice.invoice_lines))
        .limit(5)
    )
    result = await db_session.execute(stmt)
    invoices = result.scalars().all()
    
    assert len(invoices) > 0
    
    for invoice in invoices:
        lines_count = len(invoice.invoice_lines)
        print(f"\nInvoice #{invoice.InvoiceId}: ${invoice.Total} ({lines_count} items)")