import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)

    DATABASE_URL = os.getenv("DATABASE_URL")

    if DATABASE_URL:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # URL-encode password to handle special characters like @
        db_password = quote_plus(os.getenv("DB_PASSWORD", ""))

        SQLALCHEMY_DATABASE_URI = (
            f"mysql+pymysql://{os.getenv('DB_USERNAME')}:"
            f"{db_password}@"
            f"{os.getenv('DB_HOST')}/"
            f"{os.getenv('DB_NAME')}"
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False