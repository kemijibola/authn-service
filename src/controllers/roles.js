const BaseController = require('./baseController');
const { UNTAPPEDUSERTYPES } = require('../lib/constants');
const ApiResponse = require('../models/response');
const { authorizationService, emailService } = require('../services/index');
const { sendMail } = require('../lib/helpers');
const mongoose = require('mongoose');

class Roles extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const roles = this.lib.db.model('Role').find();
        this.writeHAL(res, roles);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const roleExist = await this.lib.db.model('Role').findOne({ name: body.name });
                if(roleExist) return next(this.Error(res, 'DuplicateRecord', `Role with name ${ roleExist.name } exists.`))
                const userType = await this.lib.db.model('UserType').findById({ _id: body.user_type_id })
                if(!userType) return next(this.Error(res, 'EntityNotFound', `Could not determine user type of: ${ body.user_type_id }`))
                let newRole = this.lib.db.model('Role')(body);
                const role = await newRole.save();
                // if (role && typeof role.log === 'function'){
                //     const data = {
                //         action: `create-role of ${role._id}`, // should capture action id for tracking e.g userType._id
                //         category: 'role',
                //         // createdBy: req.user.id,
                //         createdBy: 'test user',
                //         message: 'Created role'
                //     }
                //     role.log(data);
                // }
                return this.writeHAL(res, role);
            }catch(err){
                next(this.Error(res, 'InternalServerError', err.message))
            }
        }else {
            next(this.Error(res, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = function(lib){
    let controller = new Roles(lib);
    controller.addAction({
        'path': '/roles',
        'method': 'POST',
        'summary': 'Adds a new role to the database',
        'responseClass': 'Role',
        'nickName': 'addRole',
    }, controller.create)

    controller.addAction({
        'path': '/roles',
        'method': 'GET',
        'summary': 'Index page',
        'responseClass': 'Role',
        'nickName': 'getRoles',
    }, controller.index)

    return controller;
}