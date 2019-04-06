const mongoose = require('mongoose');
const helpers = require('../lib/helpers');

module.exports = function(db) {
    let schema = require("../schemas/accountStatus");   
    let modelDef = db.getModelFromSchema(schema)
    

    modelDef.schema.methods.toHAL = function(){                
        let json = JSON.stringify(this) //toJSON()                
        return helpers.makeHAL(json);        
    }

    return mongoose.model(modelDef.name, modelDef.schema)
}