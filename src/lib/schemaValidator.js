const tv4 = require('tv4');
const formats = require('tv4-formats');
const schemas = require('../request_schemas/')

module.exports = {
    validateRequest: validate
}
function validate(req){
    let res = { valid: true };
    tv4.addFormat(formats);
    let schemaKey = req.originalUrl ? req.originalUrl.toString().replace('/', '') : '' ;
    let actionKey = req.method;
    let mySchema = null;
    if (schemas[schemaKey]){
        mySchema = schemas[schemaKey][actionKey];
        let data = null;
        if (mySchema){
            switch(mySchema.validate){
                case 'params':
                    data = req.params
                case 'body':
                    data = req.body
                break;
            }
            res = tv4.validateMultiple(data, mySchema.schema)
        }
    }
    return res;
}