const mongoose = require('mongoose');
const helpers = require('../lib/helpers');
const timestamp = require('./plugins/timestamp');
const auditTrail = require('./plugins/audit');

module.exports = db => {
    let schema = require("../schemas/role");  
    let modelDef = db.getModelFromSchema(schema)
    
    modelDef.schema.plugin(timestamp(schema));
    modelDef.schema.plugin(auditTrail(schema, req.user._id));

    modelDef.schema.methods.toHAL = function(){                
        let json = JSON.stringify(this) //toJSON()                
        return helpers.makeHAL(json);        
    }

    return mongoose.model(modelDef.name, modelDef.schema)
}