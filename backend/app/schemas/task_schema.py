from marshmallow import Schema, fields, validate


class TaskSchema(Schema):

    title = fields.String(
        required=True,
        validate=validate.Length(min=1, max=255)
    )

    description = fields.String()

    status = fields.String(
        validate=validate.OneOf([
            "pending",
            "in_progress",
            "completed"
        ])
    )