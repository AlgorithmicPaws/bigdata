from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Track
from app import schemas

router = APIRouter(prefix="/tracks", tags=["Tracks"])


@router.get("/", response_model=list[schemas.TrackOut])
async def get_tracks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Track))
    return result.scalars().all()


@router.post("/", response_model=schemas.TrackOut)
async def create_track(track: schemas.TrackCreate, db: AsyncSession = Depends(get_db)):
    new_track = Track(**track.dict())
    db.add(new_track)
    await db.commit()
    await db.refresh(new_track)
    return new_track
