# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_URL: str = "mysql+aiomysql://admin:12345678@database-chinook.csxrsmg9ek92.us-east-1.rds.amazonaws.com:3306/Chinook_AutoIncrement"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
