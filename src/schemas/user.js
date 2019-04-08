module.exports = {
    "id": "User",
    "properties": {
        "email": {
            "type": "string",
            "unique": true,
            "description": "Email address of user."
        },
        "password": {
            "type": "string",
            "description": "Password of user."
        },
        "emailConfirmed": {
            "type": "boolean",
            "default": false,
            "description": "User email confirmation status."
        },
        "phoneConfimed": {
            "type": "boolean",
            "default": false,
            "description": " User phone number confirmation status."
        },
        "profileCompleted": {
            "type": "boolean",
            "default": false,
            "description": "Profile completetion status."
        },
        "generalNotification": {
            "type": "boolean",
            "default": true,
            "description": "User generation notification preference."
        },
        "emailNotification": {
            "type": "boolean",
            "default": true,
            "description": "User email notification preference."
        },
        "profileVisibility": {
            "type": "boolean",
            "default": true,
            "description": "User profile visibility preference."
        },
        "loginCount": {
            "type": "number",
            "default": 0,
            "description": "User login count."
        },
        "status": {
            "type": "array",
            "description": "User account status. Could be array of any type of object",
            "items": {
                "type": "mixed"
            }
        },
        "roles": {
            "type": "array",
            "description": "List of user roles",
            "items": {
                "$ref": "Role"
            }
        }
    }
}