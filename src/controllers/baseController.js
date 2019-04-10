const halson = require('halson');
const ErrorHandler = require('../lib/errorHandler');
const {ERRORCODES} = require('../lib/constants');
const logger = require('../lib/logger');
const mongoose = require('mongoose');
const helpers = require('../lib/helpers');

class BaseController {
    constructor(){
        this.actions = [];
        this.server = null;
    }

    setUpActions(app, sw){
        this.server = app;
        this.actions.forEach(action => {
            let method = action['spec']['method'];
            // uncomment when setting up swagger
            // logger.info(`Setting up auto-doc for (${method} ) - ${action['spec']['nickName']}`)
            //sw['add' + method](action);
            app[method.toLowerCase()](action['spec']['path'], action['action']);
        });
    }
    addAction(spec,fn){
        let newAct = {
            'spec': spec,
            'action': fn.bind(this)
        }
        this.actions.push(newAct);
    }
    
    Error(res, type, msg){
        logger.error("Error of type " + type + " found: " + msg);
        const error = new ErrorHandler(`Error of type ${type} found: ${msg}`);
        if (ERRORCODES[type]){
            return res.status(ERRORCODES[type]).json({
                name: error.name,
                type: type,
                msg: error.message,
                info: error.stack
            });
        } else {
            
            return res.json({
                error: true,
                name: error.name,
                type: type,
                msg: error.message,
                info: error.stack
            })
        }
    }

    writeHAL(res, obj){
        if(Array.isArray(obj)){
            let newArr = obj.map(item => {
                if (typeof(item._id) === 'string'){
                    item._id = mongoose.Types.ObjectId(item._id);
                    let json = JSON.stringify(item)               
                    return helpers.makeHAL(json);  
                }
                return item.toHAL();
            });
            obj = halson(newArr);
        }else {
            if (obj && obj.toHAL){
                obj = obj.toHAL();
            }
        }
        if (!obj){
             obj = {}
        }
        return res.json(obj);
    }
}

module.exports = BaseController;