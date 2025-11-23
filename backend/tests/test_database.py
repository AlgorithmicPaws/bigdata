import pytest
from sqlalchemy import text


@pytest.mark.asyncio
async def test_database_connection(db_session):
    """Verifica que la conexión a la DB funcione"""
    result = await db_session.execute(text("SELECT 1 as number"))
    row = result.fetchone()
    assert row[0] == 1


@pytest.mark.asyncio
async def test_database_has_chinook_tables(db_session):
    """Verifica que existan las tablas principales de Chinook"""
    tables_to_check = ['Artist', 'Album', 'Track', 'Customer', 'Employee', 'Invoice', 'InvoiceLine']
    
    for table in tables_to_check:
        query = text(f"SHOW TABLES LIKE '{table}'")
        result = await db_session.execute(query)
        row = result.fetchone()
        assert row is not None, f"La tabla {table} no existe en la BD"


@pytest.mark.asyncio
async def test_invoice_has_employee_column(db_session):
    """Verifica que Invoice tenga la columna EmployeeId (tu alteración)"""
    query = text("""
        SELECT COLUMN_NAME, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'Invoice' 
        AND COLUMN_NAME = 'EmployeeId'
    """)
    result = await db_session.execute(query)
    row = result.fetchone()
    
    assert row is not None, "La columna EmployeeId no existe en Invoice"
    assert row[1] == 'YES', "EmployeeId debería ser nullable"


@pytest.mark.asyncio
async def test_count_records_in_tables(db_session):
    """Verifica que haya datos en las tablas principales"""
    queries = {
        'Artist': text("SELECT COUNT(*) FROM Artist"),
        'Album': text("SELECT COUNT(*) FROM Album"),
        'Track': text("SELECT COUNT(*) FROM Track"),
        'Customer': text("SELECT COUNT(*) FROM Customer"),
        'Employee': text("SELECT COUNT(*) FROM Employee"),
    }
    
    for table_name, query in queries.items():
        result = await db_session.execute(query)
        count = result.scalar()
        print(f"\n{table_name}: {count} registros")
        assert count > 0, f"No hay datos en la tabla {table_name}"