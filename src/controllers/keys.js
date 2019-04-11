const BaseController = require('./baseController');
const { UNTAPPEDUSERTYPES } = require('../lib/constants');
const ApiResponse = require('../models/response');
const { authorizationService, emailService } = require('../services/index');
const { sendMail } = require('../lib/helpers');
const mongoose = require('mongoose');

class Keys extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    // only return kid,publicKey of key queried
    async getPublicKeyByKeyId(kid){

    }

    // This is a consious operation and must not support batch deactivation / activation
    async deactivateKey(key){

    }

    // protect create route for only ADMINs / BackOffice users
    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                
                const canAddKey = await this.lib.db.model('Key').findOne({ activated: true });
                if(canAddKey) return next(this.Error(res, 'DuplicateRecord', `Key id: ${canAddKey.kid} is currently in use. Deactivate key before activating another one.`)) 
                
                let newKey = this.lib.db.model('Key')(body);
                const key = await newKey.save();
                // if (key && typeof key.log === 'function'){
                //     const data = {
                //         action: `create-key of ${key._id}`, // should capture action id for tracking e.g userType._id
                //         category: 'key',
                //         // createdBy: req.user.id,
                //         createdBy: 'test user',
                //         message: 'Created key'
                //     }
                //     role.log(data);
                // }
                return this.writeHAL(res, key);
            }catch(err){
                next(this.Error(res, 'InternalServerError', err.message))
            }
        }else {
            next(this.Error(res, 'InvalidContent', 'Missing json data.'));
        }
    }
    // update key's in db
    // Only one key can be set active = true
    // deactivate each key and enforce active key one at a time
}

module.exports = function(lib){
    let controller = new Keys(lib);
    controller.addAction({
        'path': '/api/jwt/keys',
        'method': 'POST',
        'summary': 'Adds a new key to the database',
        'responseClass': 'Role',
        'nickName': 'addKey',
    }, controller.create)

    return controller;
}