const ERRORCODES = {
    BadDigest: 400,
    BadMethod: 405,
    ConnectTimeout: 408,
    InternalServerError: 500,
    InvalidArgument: 409,
    ResourceNotFoundError: 404,
    InvalidContent: 400,
    InvalidCredentials: 401,
    InvalidHeader: 400,
    InvalidVersion: 400,
    MissingParameter: 409,
    NotAuthorized: 403,
    RequestExpired: 400,
    RequestThrottled: 429,
    ResourceNotFound: 404,
    WrongAccept: 406
}

const UNTAPPEDUSERTYPES = {
    TALENT: 'Talent',
    AUDIENCE: 'Audience',
    PROFESSIONAL: 'Professional'
}

module.exports = Object.assign({}, { ERRORCODES, UNTAPPEDUSERTYPES })