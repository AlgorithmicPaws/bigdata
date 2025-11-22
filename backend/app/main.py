from fastapi import FastAPI
from app.routers import customers, tracks, purchases

app = FastAPI()

app.include_router(customers.router)
app.include_router(tracks.router)
app.include_router(purchases.router)

@app.get("/")
async def root():
    return {"message": "Online Music Store API running"}
