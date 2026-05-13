swagger_template = {
    "swagger": "2.0",

    "info": {
        "title": "TaskFlow-API",
        "description": "Flask REST API with JWT Auth",
        "version": "1.0.0"
    },

    "securityDefinitions": {
        "BearerAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": (
                "Enter: Bearer <JWT_TOKEN>"
            )
        }
    }
}