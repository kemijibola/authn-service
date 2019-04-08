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
        if(body){
            try{
                const userType = '';
                let criteria = {};
                this.lib.db.model('UserType')
                    .findOne({ _id: body.user_type_id })
                    .exec((err, type) => {
                        if(err) next(this.Error('InternalServerError', err.message))
                        if(!type) next(this.Error('ResourceNotFoundError', `Could not determine type of user for: ${id}`));
                        userType = type.name;
                })
                const roles = await this.lib.model('Role').find({ userTypeId: body.user_type_id });
                let newUser;
                let scopes;
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
            }catch(err){
                next(this.Error('InternalServerError', err.message))
            }
        }else {
            next(this.Error('InvalidContent', 'Missing json data.'));
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

    static async createUser(body, roles){
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
    }, controller.signup)

    // controller.addAction({
    //     'path': '/users',
    //     'method': 'GET',
    //     'summary': 'Index page',
    //     'responseClass': 'User',
    //     'nickName': 'getUsers',
    // }, controller.index)

    // controller.addAction({
    //     'path': '/users/:id',
    //     'method': 'GET',
    //     'summary': 'Index page',
    //     'responseClass': 'User',
    //     'nickName': 'getUser',
    // }, controller.getById)

    return controller;
}