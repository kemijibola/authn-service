var Request = require("request");

module.exports = (payload) => {
    return new Promise((resolve,reject) => {
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://",
            "body": JSON.stringify({
                "roles": payload.roles,
                "audience": payload.aud
            })
        }, (error, response, body) => {
            if (error) reject(
                'An error occured with the authorization service, err:', error
            )
            resolve(JSON.parse(body));
        })
    })
}