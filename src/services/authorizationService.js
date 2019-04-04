var Request = require("request");

module.exports = (payload) => {
    return new Promise((resove,reject) => {
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://",
            "body": JSON.stringify({
                "roles": payload
            })
        }, (error, response, body) => {
            if (error) reject(
                'An error occured with the authorization service, err:', error
            )
            resolve(JSON.parse(body));
        })
    })
}