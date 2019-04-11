const mongoose = require('mongoose');
const helpers = require('../lib/helpers');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

module.exports = function(db){
    let schema = require("../schemas/key");  
    let modelDef = db.getModelFromSchema(schema);

    modelDef.schema.plugin(require('./plugins/diffPlugin'));

    modelDef.schema.plugin(autoIncrement.plugin, 
        { 
            model: 'Key', 
            field: 'kid',
            startAt: 1,
            incrementBy: 1
    });

    modelDef.schema.methods.toHAL = function(){                
        let json = JSON.stringify(this) //toJSON()                
        return helpers.makeHAL(json);        
    }


    return mongoose.model(modelDef.name, modelDef.schema)
}