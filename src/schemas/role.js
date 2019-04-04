module.exports = {
    "id": "Role",
    "properties": {
        "name": {
            "type": "string",
            "unique": true,
            "description": "Name of role."
        },
        "userTypeId": {
            "type": "string",
            "description": "User the role is assigned to (UserType)."
        },
        "accessibility": {
            "type": "string",
            "description": "Accessibility level of role."
        }
    }
}