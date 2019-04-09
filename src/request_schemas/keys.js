module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
                "kid": {
                    "type": 'number'
                },
               "type": {
                    "type": 'string'
                },
                "publicKey": {
                    "type": 'string'
                },
                "privateKey": {
                    "type": 'string'
                },
                "activated": {
                    "type": "boolean"
                }
            },
            "required": ['kid','type', 'publicKey', 'privateKey', 'activated']
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