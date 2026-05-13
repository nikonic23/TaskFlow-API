from flask import Flask

from flasgger import Swagger
from app.docs.swagger import swagger_template
from flask_cors import CORS


from app.config.config import Config
from app.extensions.db import db
from app.extensions.jwt import jwt
from app.extensions.migrate import migrate
from app.extensions.bcrypt import bcrypt

from app.models.user_model import User
from app.models.task_model import Task

from app.routes.auth_routes import auth_bp
from app.routes.admin_routes import admin_bp
from app.routes.task_routes import task_bp

def create_app():
    app = Flask(__name__)

    CORS(app)

    Swagger(
        app,
        template=swagger_template
    )

    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        db.create_all()

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(task_bp)

    @app.route("/")
    def home():
        return {
            "message": "Backend running successfully"
        }

    return app