from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Employee


async def get_employee(db: AsyncSession, employee_id: int) -> Employee | None:
    """Obtiene un empleado por ID"""
    result = await db.execute(
        select(Employee).where(Employee.EmployeeId == employee_id)
    )
    return result.scalar_one_or_none()