class ErrorHandler extends Error {
    constructor(message){
        super(message);
        this.name = 'Auth Service Error';
        this.message = message;
    }
}

module.exports = ErrorHandler;