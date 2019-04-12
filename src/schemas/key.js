module.exports = {
    "id": "Key",
    "properties": {
        "kid": {
            "type": 'number',
            "default": 0,
            "description": "Key id."
        },
        "type": {
            "type": "string",
            "description": "Key type. i.e RSA256."
        },
        "public_key": {
            "type": "string",
            "description": "Public key.",
        },
        "private_key": {
            "type": "string",
            "description": "Private key.",
        },
        "activated": {
            "type": "boolean",
            "description": "Describes status of the key"
        }
    }
}