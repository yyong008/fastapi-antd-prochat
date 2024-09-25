from pydantic_settings import SettingsConfigDict, BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
  api_key: str
  SUPABASE_URL: str
  SUPABASE_KEY: str
  model_config = SettingsConfigDict(env_file=".env")

@lru_cache
def get_settings():
  settings = Settings()
  return settings
