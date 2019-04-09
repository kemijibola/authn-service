const BaseController = require('./baseController');
const { UNTAPPEDUSERTYPES } = require('../lib/constants');
const ApiResponse = require('../models/response');
const { authorizationService, emailService } = require('../services/index');
const { sendMail } = require('../lib/helpers');

class UserTypes extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const roles = await this.lib.db.model('UserType').find().cache();
        this.writeHAL(res, roles);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const userTypeExist = await this.lib.db.model('UserType').findOne({name: body.name});
                if(userTypeExist) return next(this.Error(res, 'DuplicateRecord', `User type with name ${userTypeExist.name} exists.`))
                let newUserType = this.lib.db.model('UserType')(body);
                const userType = await newUserType.save();
                if (userType && typeof userType.log === 'function'){
                    const data = {
                        action: `create-user-type of ${userType._id}`, // should capture action id for tracking e.g userType._id
                        category: 'user-types',
                        // createdBy: req.user.id,
                        createdBy: 'test user',
                        message: 'Created user type'
                    }
                    userType.log(data);
                }
                return this.writeHAL(res, userType);
            }catch(err){
                next(this.Error(res, 'InternalServerError', err.message))
            }
        }else {
            next(this.Error(res, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = function(lib){
    let controller = new UserTypes(lib);
    controller.addAction({
        'path': '/user-types',
        'method': 'POST',
        'summary': 'Adds a new user-type to the database',
        'responseClass': 'UserType',
        'nickName': 'addUserType',
    }, controller.create)

    controller.addAction({
        'path': '/user-types',
        'method': 'GET',
        'summary': 'Adds a new user-type to the database',
        'responseClass': 'UserType',
        'nickName': 'getTypes',
    }, controller.index)

    return controller;
}