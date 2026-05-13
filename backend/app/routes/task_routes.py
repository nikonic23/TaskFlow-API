from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.schemas.task_schema import TaskSchema

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.extensions.db import db

from app.models.task_model import Task
from app.models.user_model import User


task_bp = Blueprint(
    "tasks",
    __name__,
    url_prefix="/api/v1/tasks"
)


# CREATE TASK
@task_bp.route("/", methods=["POST"])
@jwt_required()
def create_task():
    """
    Create a new task
    ---
    tags:
      - Tasks

    security:
      - BearerAuth: []

    parameters:
      - in: body
        name: body
        required: true

        schema:
          type: object

          properties:
            title:
              type: string
              example: Build backend

            description:
              type: string
              example: Finish Flask API

    responses:
      201:
        description: Task created successfully

      400:
        description: Validation error

      401:
        description: Unauthorized
    """
    current_user_id = get_jwt_identity()

    try:
        data = TaskSchema().load(
            request.get_json()
        )
    except ValidationError as err:
        return jsonify(err.messages), 400

    title = data.get("title")
    description = data.get("description")

    if not title:
        return jsonify({
            "error": "Title is required"
        }), 400

    new_task = Task(
        title=title,
        description=description,
        user_id=current_user_id
    )

    db.session.add(new_task)
    db.session.commit()

    return jsonify({
        "message": "Task created successfully"
    }), 201


# GET ALL TASKS
@task_bp.route("/", methods=["GET"])
@jwt_required()
def get_tasks():
    """
    Get all tasks
    ---
    tags:
      - Tasks

    security:
      - BearerAuth: []

    responses:
      200:
        description: Tasks fetched successfully

      401:
        description: Unauthorized
    """
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if user.role == "admin":
        tasks = Task.query.all()
    else:
        tasks = Task.query.filter_by(
            user_id=current_user_id
        ).all()

    tasks_data = []

    for task in tasks:
        tasks_data.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id
        })

    return jsonify(tasks_data), 200


# GET SINGLE TASK
@task_bp.route("/<int:task_id>", methods=["GET"])
@jwt_required()
def get_single_task(task_id):
    """
    Get a single task
    ---
    tags:
      - Tasks

    security:
      - BearerAuth: []

    parameters:
      - in: path
        name: task_id
        required: true
        type: integer

    responses:
      200:
        description: Task fetched successfully

      403:
        description: Access denied

      404:
        description: Task not found

      401:
        description: Unauthorized
    """
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    task = Task.query.get(task_id)

    if not task:
        return jsonify({
            "error": "Task not found"
        }), 404

    if (
        user.role != "admin" and
        task.user_id != current_user_id
    ):
        return jsonify({
            "error": "Access denied"
        }), 403

    return jsonify({
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "user_id": task.user_id
    }), 200


# UPDATE TASK
@task_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    """
    Update a task
    ---
    tags:
      - Tasks

    security:
      - BearerAuth: []

    parameters:
      - in: path
        name: task_id
        required: true
        type: integer

      - in: body
        name: body
        required: true

        schema:
          type: object

          properties:
            title:
              type: string

            description:
              type: string

            status:
              type: string
              example: completed

    responses:
      200:
        description: Task updated successfully

      403:
        description: Access denied

      404:
        description: Task not found

      401:
        description: Unauthorized
    """
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    task = Task.query.get(task_id)

    if not task:
        return jsonify({
            "error": "Task not found"
        }), 404

    if (
        user.role != "admin" and
        task.user_id != current_user_id
    ):
        return jsonify({
            "error": "Access denied"
        }), 403

    try:
        data = TaskSchema(partial=True).load(
            request.get_json()
        )
    except ValidationError as err:
        return jsonify(err.messages), 400

    task.title = data.get(
        "title",
        task.title
    )

    task.description = data.get(
        "description",
        task.description
    )

    task.status = data.get(
        "status",
        task.status
    )

    db.session.commit()

    return jsonify({
        "message": "Task updated successfully"
    }), 200


# DELETE TASK
@task_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    """
    Delete a task
    ---
    tags:
      - Tasks

    security:
      - BearerAuth: []

    parameters:
      - in: path
        name: task_id
        required: true
        type: integer

    responses:
      200:
        description: Task deleted successfully

      403:
        description: Access denied

      404:
        description: Task not found

      401:
        description: Unauthorized
    """
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    task = Task.query.get(task_id)

    if not task:
        return jsonify({
            "error": "Task not found"
        }), 404

    if (
        user.role != "admin" and
        task.user_id != current_user_id
    ):
        return jsonify({
            "error": "Access denied"
        }), 403

    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "message": "Task deleted successfully"
    }), 200