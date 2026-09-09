from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    app_name: str = "MOIL Backend"
    # Frontend URLs allowed to call FastAPI
    cors_origins: str = (
        "https://mnvisionai.vercel.app"
       
    )

    gemini_api_key: str | None = None
    gemini_model: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )
    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


settings = Settings()