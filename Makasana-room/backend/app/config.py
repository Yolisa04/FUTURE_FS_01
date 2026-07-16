import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """
    Central place for all the env-driven config. Nothing fancy - just
    pulling values out of the environment with sane local-dev defaults
    so the app boots even if you haven't set up a .env yet.
    """

    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "makasana_room")

    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret-change-me-in-prod")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))

    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    RESEND_FROM_EMAIL: str = os.getenv("RESEND_FROM_EMAIL", "bookings@makasanaroom.com")

    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_FROM_NUMBER: str = os.getenv("TWILIO_FROM_NUMBER", "")

    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

    BUSINESS_TIMEZONE: str = os.getenv("BUSINESS_TIMEZONE", "America/New_York")
    CLOSED_WEEKDAY: int = int(os.getenv("CLOSED_WEEKDAY", "0"))  # 0 = Monday


settings = Settings()
