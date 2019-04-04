module.exports = {
    "id": "Application",
    "properties": {
        "name": {
            "type": "string",
            "unique": true,
            "description": "App registration name"
        },
        "clientId": {
            "type": "string",
            "unique": true,
            "description": "Public key for application."
        },
        "secretKey": {
            "type": "string",
            "unique": true,
            "description": "Private key for application."
        },
        "successRedirect": {
            "type": "string",
            "description": "This is the Url that will be redirected after successful login"
        }
    }
}