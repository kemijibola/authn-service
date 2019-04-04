class ApiResponse {
    constructor(user, token, scopes = []){
        this.user = user;
        this.token = token;
        this.scopes = scopes
    }
}

module.exports = ApiResponse;