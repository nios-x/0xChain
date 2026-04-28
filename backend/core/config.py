from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Real-Time Resilient Logistics System"
    DATABASE_URL: str = "sqlite+aiosqlite:///./ssc.db"
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
