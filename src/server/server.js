const swagger = require("swagger-node-express")
const ErrorHandler = require('../lib/errorHandler');
const lib = require('../lib');
const bodyParser = require('body-parser');
require('../services/cache');

module.exports = (options) => {
    if(!options){
        throw (new ErrorHandler('The app has not been started.'));
    }
    if (!options.port) {
        throw (new ErrorHandler('Authentication server must be started with an available port'))
    }

    const { app, port } = options;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use((req, res, next) => {
        let results = lib.schemaValidator.validateRequest(req);
        if(results.valid){
            return next();
        }
        res.status(400).send(results);
    })

    lib.helpers.setupRoutes(app, swagger, lib);

    return app.listen(port.port, () => {
        lib.logger.info(`Server started successfully on ${port.port}`);
        lib.db.connect(err => {
            if(err) lib.logger.error(`Error trying to connect to database: ${err}`);
            lib.logger.info('Database service successfully started');
        })
    });
}