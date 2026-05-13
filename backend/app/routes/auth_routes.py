from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from app.extensions.db import db
from app.extensions.bcrypt import bcrypt

from app.models.user_model import User

from app.schemas.user_schema import (
    RegisterSchema,
    LoginSchema
)

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/v1/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user
    ---
    tags:
      - Auth

    parameters:
      - in: body
        name: body
        required: true

        schema:
          type: object

          properties:
            username:
              type: string
              example: nikhil

            email:
              type: string
              example: nikhil@gmail.com

            password:
              type: string
              example: 123456

    responses:
      201:
        description: User registered successfully

      400:
        description: Validation error

      409:
        description: User already exists
    """
    try:
        data = RegisterSchema().load(
        request.get_json()
    )
    except ValidationError as err:
        return jsonify(err.messages), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({
            "error": "All fields are required"
        }), 400

    existing_user = User.query.filter(
        (User.email == email) |
        (User.username == username)
    ).first()

    if existing_user:
        return jsonify({
            "error": "User already exists"
        }), 409

    hashed_password = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")

    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Login user
    ---
    tags:
      - Auth

    parameters:
      - in: body
        name: body
        required: true

        schema:
          type: object

          properties:
            email:
              type: string
              example: nikhil@gmail.com

            password:
              type: string
              example: 123456

    responses:
      200:
        description: Login successful

      401:
        description: Invalid credentials
    """
    try:
        data = LoginSchema().load(
        request.get_json()
    )
    except ValidationError as err:
        return jsonify(err.messages), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password required"
        }), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return jsonify({
            "error": "Invalid credentials"
        }), 401

    password_match = bcrypt.check_password_hash(
        user.password,
        password
    )

    if not password_match:
        return jsonify({
            "error": "Invalid credentials"
        }), 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }), 200


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    """
    Get current user profile
    ---
    tags:
      - Auth

    security:
      - BearerAuth: []

    responses:
      200:
        description: User profile fetched successfully

      401:
        description: Unauthorized
    """
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }), 200