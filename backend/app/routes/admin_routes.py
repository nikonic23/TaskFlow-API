from flask import Blueprint, jsonify

from app.middleware.role_middleware import role_required

from app.models.user_model import User


admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/v1/admin"
)


@admin_bp.route("/users", methods=["GET"])
@role_required("admin")
def get_all_users():
    """
    Get all users (Admin only)
    ---
    tags:
      - Admin

    security:
      - BearerAuth: []

    responses:
      200:
        description: Users fetched successfully

      401:
        description: Unauthorized

      403:
        description: Forbidden - Admin access required
    """
    users = User.query.all()

    users_data = []

    for user in users:
        users_data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        })

    return jsonify(users_data), 200