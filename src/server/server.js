const swagger = require("swagger-node-express")
const ErrorHandler = require('../lib/errorHandler');
const lib = require('../lib');
const bodyParser = require('body-parser');

module.exports = (options) => {
    if(!options){
        throw (new ErrorHandler('The app has not been started.'));
    }
    if (!options.port) {
        throw (new ErrorHandler('The server must be started with an available port'))
    }

    const { app, port } = options;
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        let results = lib.schemaValidator.validateRequest(req);
        if(results.valid){
            return next();
        }
        res.send(400, results);
    })

    lib.helpers.setupRoutes(app, swagger, lib);

    return app.listen(port, () => {
        lib.logger.info(`Server started successfully on ${port}`);
        lib.db.connect(err => {
            if(err) lib.logger.error(`Error trying to connect to database: ${err}`);
            lib.logger.info('Database service successfully started');
            const mongoose = require('mongoose')
            mongoose.plugin(require('../models/plugins/diffPlugin'));
        })
    });
}