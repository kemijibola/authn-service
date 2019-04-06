const express = require('express');
const halson = require('halson');
const ErrorHandler = require('../lib/errorHandler');
const {ERRORCODES} = require('../lib/constants');

class BaseController {
    constructor(){
        this.actions = [];
        this.server = null;
    }

    setUpActions(app, sw){
        this.server = app;
        this.actions.forEach(action => {
            let method = action['spec']['method'];
            // logger.info(`Setting up auto-doc for (${method} ) - ${act['spec']['nickname']}`)
            sw['add' + method](action);
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
    
    Error(type,msg){
        // logger.error("Error of type" + type + "found:" + msg. toString())
        if (ERRORCODES[type]){
            return new ErrorHandler(type, msg);
        } else {
            return {
                error: true,
                type: type,
                msg: msg
            }
        }
    }

    writeHAL(res, obj){
        if(Array.isArray(obj)){
            let newArr = obj.map(item => {
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
        res.json(obj);
    }
}

module.exports = BaseController;