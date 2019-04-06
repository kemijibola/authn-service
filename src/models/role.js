const mongoose = require('mongoose');
const helpers = require('../lib/helpers');
const diffPlugin = require('../models/plugins/diffPlugin');

module.exports = function(db){
    let schema = require("../schemas/role");  
    let modelDef = db.getModelFromSchema(schema);

    modelDef.schema.methods.toHAL = function(){                
        let json = JSON.stringify(this) //toJSON()                
        return helpers.makeHAL(json);        
    }

    return mongoose.model(modelDef.name, modelDef.schema)
}