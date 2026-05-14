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
        db_username = os.getenv("DB_USERNAME", "root")
        db_host = os.getenv("DB_HOST", "localhost")
        db_name = os.getenv("DB_NAME", "internshala_backend")

        SQLALCHEMY_DATABASE_URI = (
            f"mysql+pymysql://{db_username}:"
            f"{db_password}@"
            f"{db_host}/"
            f"{db_name}"
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
