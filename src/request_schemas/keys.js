module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "type": {
                    "type": 'string'
                },
                "public_key": {
                    "type": 'string'
                },
                "private_key": {
                    "type": 'string'
                },
                "activated": {
                    "type": "boolean"
                }
            },
            "required": ['type', 'public_key', 'private_key', 'activated']
        }
    },
    "PUT": {
        "validate": 'params',
        "schema": {
            "type": "object",
            "properties": {
               "id": {
                    "type": 'string'
                }
            },
            "required": ['id']
        }
    },
    "DELETE": {
        "validate": 'params',
        "schema": {
            "type": "object",
            "properties": {
               "id": {
                    "type": 'string'
                }
            },
            "required": ['id']
        }
    }
}