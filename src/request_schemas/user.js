module.exports = {
    getUserById: {
        validate: 'params',
        schema: {
            type: "object",
            properties: {
                user_id: {
                    type: 'string'
                }
            }
        }
    },
    createUser: {
        validate: 'body',
        schema: {
            type: "object",
            properties: {
                email: {
                    type: 'string',
                    format: 'email'
                },
                password: {
                    type: 'string'
                },
                role_id: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            }
        }
    }
}