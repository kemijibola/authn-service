module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "email": {
                    "type": 'string',
                    "format": 'email'
                },
                "password": {
                    "type": 'string'
                },
                "user_type_id": {
                    "type": 'string'
                }
            },
            "required": ['email', 'password', 'user_type_id']
        }
    },
    "GET": {
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