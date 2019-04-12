const BaseController = require('./baseController');
const { UNTAPPEDUSERTYPES, JWTOPTIONS} = require('../lib/constants');
const ApiResponse = require('../models/response');
const { authorizationService, emailService } = require('../services/index');
const { sendMail } = require('../lib/helpers');
const config = require('config');
// var AWS = require('aws-sdk');
// AWS.config.region = 'us-east-2b';
// var s3 = new AWS.S3();
class Users extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }
    async login(req, res, next){

        /* In login implementation, use audience and user roles to send back scopes(permissions) of the user
        **   For example: ClientApp1 is an audience, send back roles needed for clientApp1
        */ 
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
                // This is checking that the user_type_id sent by client is a valid type of user 
                // in the database. For Example: Talent,Audience,Professional

                const userType = await this.lib.db.model('UserType').findById({ _id: body.user_type_id })
                if(!userType) return next(this.Error(res, 'EntityNotFound', `Could not determine user type of: ${ body.user_type_id }`))

                // We are getting the roles of the user based on the type of user the client sent
                const roles = await this.lib.db.model('Role').find({ user_type_id: body.user_type_id });
                
                const newUser = await this.createUser(roles, body);
                // send WelcomePack Mail based on type of user
                this.writeHAL(res, newUser.token);
            }catch(err){
                next(res, this.Error(res,'InternalServerError', err.message))
            }
        }else {
            next(this.Error(res, 'InvalidContent', 'Missing json data.'));
        }
    }

    async emailExists(req, res, next){
        let body = req.body
        if (body){
            try {
                const email = await this.lib.model('User').findOne({email: body.email.toLowerCase()});
                this.writeHAL(res, email);
            }catch(err){
                next(this.Error('InternalServerError', err));
            }
        }else {
            next(this.Error('InvalidContent', 'Missing json data'));
        }
    }

    async createUser(roles, body){
        let signOptions = {
            issuer: JWTOPTIONS.ISSUER,
            subject: '',
            audience: body.audience,
            expiresIn: JWTOPTIONS.EXPIRESIN,
            algorithm: config.publicKeys[JWTOPTIONS.CURRENTKEY].type,
            keyid: JWTOPTIONS.CURRENTKEY
        }
        const userObj = {
            email: body.email,
            password: body.password    
        }
        const payload = {
            scopes: []
        };
        const privateKey = config.secretKeys[JWTOPTIONS.CURRENTKEY].replace(/\\n/g, '\n');
        let newUser = await this.lib.db.model('User')(userObj);
        const user = await newUser.save();
        
        // The user has not yet verified email, sending them a token with empty scopes
        // is to allow them into the app with limited permissions
        // This is applicable to all types of users in the database

        const token = await user.generateAuthToken(privateKey, signOptions, payload);
        await user.addRoles(user._id, roles);
        return { token: token };
    }

    async getCurrentApiKey(){

        // production implementation store private key in (AWS)

        let params = {
            Bucket: 'jether-tech-credentials',
            Key: 'web-app/secretKeys.json'
        }
        s3.getObject(params, function(err, data) {
            if (err) {
                console.log('error',err);
            } else {
                data = JSON.parse(data.Body.toString());
                for (i in data) {
                    console.log('Setting environment variable: ' + i);
                    process.env[i] = data[i];
                }
            }
        });
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