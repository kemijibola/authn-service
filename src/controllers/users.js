const BaseController = require('./baseController');
const { UNTAPPEDUSERTYPES } = require('../lib/constants');
const ApiResponse = require('../models/response');
const { authorizationService, emailService } = require('../services/index');
const { sendMail } = require('../lib/helpers');
class Users extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    index(res){
        this.writeHAL(res, new ApiResponse('newUser.user','newUser.token', 'scopes'))
    }

    async login(req, res, next){
        let body = req.body;
        if (body){
            if (!body.email || !body.password) { next(this.Error('InvalidContent', 'Provide email and password.')); }
            const user = await this.lib.model('User').findOne({email: body.email.toLowerCase()})
            if (!user) { next(this.Error('InvalidCredentials', 'Invalid credentials.')) }
            user.comparePassword(body.password, async (err,isMatch) => {
                if(err) {
                    next(this.Error('InvalidCredentials', 'Invalid credentials'))}
                if(isMatch){
                    // get scopes by user role of user
                    const scopes = await authorizationService(user.roles);
                    // generate token
                    const token = await user.generateAuthToken();
                    // send back API Response to user
                    this.writeHAL(res, new ApiResponse(user, token, scopes));
                }else {
                    this.Error('InvalidCredentials', 'Invalid credentials')}});
        }else{
            next(this.Error('InvalidContent', 'Missing json data'));}
    }

    async signup(req, res, next){
        const body = req.body;
        let newUser;
        let scopes;
        try {
            if(body){
                if (!body.userTypeId)  next(this.Error('InvalidArgument', 'Invalid user type.'))
                const userType = '';
                let criteria = {};
                this.lib.db.model('UserType')
                    .findOne({ _id: body.userTypeId })
                    .exec((err, type) => {
                        if(err) next(this.Error('InternalServerError', err))
                        if(!type) next(this.Error('ResourceNotFoundError', `Could not determine type of user for: ${id}`));
                        userType = type.name;
                })
                const roles = await this.lib.model('Role').find({criteria});
                switch(userType){
                    case UNTAPPEDUSERTYPES.TALENT:
                        newUser = this.createUser(roles, body);
                        // send Talent welcome pack mail
                        this.sendWelcomePack({emailType: 'Welcome Pack', receivers})
                        this.writeHAL(res, new ApiResponse(newUser.user, newUser.token,scopes));
                    break;
                    case UNTAPPEDUSERTYPES.AUDIENCE:
                        newUser = this.createUser(roles,body);
                        // send Audience welcome pack mail
                        this.writeHAL(res, new ApiResponse(newUser.user, newUser.token,scopes));
                    break;
                    case UNTAPPEDUSERTYPES.PROFESSIONAL:
                        newUser = this.createUser(roles,body);
                        // send Professional welcome pack mail
                        this.writeHAL(res, new ApiResponse(newUser.user,newUser.token, scopes))
                    break;
                    default:
                    break;
                }
        }else {
            next(this.Error('InvalidContent', 'Missing json data.'));
        }
        }catch(err){
            next(this.Error('InternalServerError', err));
        }
    }

    async emailExists(req, res, next){
        let body = req.body
        if (body){
            try {
                const email = await this.lib.model('User').find({email: body.email.toLowerCase()});
                this.writeHAL(res, email);
            }catch(err){
                next(this.Error('InternalServerError', err));
            }
        }else {
            next(this.Error('InvalidContent', 'Missing json data'));
        }
    }

    async createUser(body, roles){
        let newUser = this.lib.db.model('User')(body);
        const user = await newUser.save();
        const token = await user.generateAuthToken();
        await this.lib.model('User').addRoles(user._id, roles);
        return { user: user, token: token };
    }

    async sendWelcomePack(data){
        // pass payload to email Service
        sendMail(body)
    }  
}

module.exports = function(lib){
    let controller = new Users(lib);
    controller.addAction({
        'path': '/users',
        'method': 'POST',
        'params': '',
        'summary': 'Adds a new user to the database',
        'responseClass': 'User',
        'nickName': 'addUser',
    }, controller.createUser)

    controller.addAction({
        'path': '/',
        'method': 'GET',
        'params': '',
        'summary': 'Index page',
        'responseClass': 'User',
        'nickName': 'userIndex',
    }, controller.index)

    return controller;
}