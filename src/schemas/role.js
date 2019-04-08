module.exports = {
    "id": "Role",
    "properties": {
        "name": {
            "type": "string",
            "unique": true,
            "description": "Name of role."
        },
        "userTypeId": {
            "type": "object",
            "description": "User the role is assigned to (UserType).",
            "$ref": "UserType"
        }
    }
}