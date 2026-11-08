from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    cors_origins: str = "http://localhost:3000"
    gemini_api_key: str = ""


settings = Settings()