from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Configuración de la aplicación usando Pydantic Settings V2"""
    
    # Database
    DB_HOST: str
    DB_PORT: int = 3306
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    
    # App
    APP_NAME: str = "Chinook Music Store"
    DEBUG: bool = True
    
    # Pydantic V2: usar model_config en lugar de class Config
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"  # Ignora variables env extras
    )
    
    @property
    def database_url(self) -> str:
        """Construye la URL de conexión async para MySQL"""
        return f"mysql+aiomysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


@lru_cache
def get_settings() -> Settings:
    """Retorna configuración singleton"""
    return Settings()