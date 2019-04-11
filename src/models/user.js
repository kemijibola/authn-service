const mongoose = require("mongoose");
const jsonSelect  = require('mongoose-json-select');
const helpers = require("../lib/helpers");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const config = require('config');

module.exports = function(db){
    let schema = require('../schemas/user.js');
    let modelDef = db.getModelFromSchema(schema);

    modelDef.schema.plugin(jsonSelect, '-roles');

    modelDef.schema.methods.toHAL = function(){
        let halObj = helpers.makeHAL(this.toJSON(),                                                        
        [{name: 'roles', 'href': '/users/' + this.id + '/roles', 'title': 'Roles'}]);
        if (this.roles.length > 0){
            if (this.roles[0].toString().length !== 24){
                halObj.addEmbed('roles', this.roles.map(r => {
                    return r.toHAL();
                }))
            }
        }
        return halObj;
    }
    modelDef.schema.methods.addRoles = async function(id, roles){
        const user =  await db.model('User').findById(id);
        user.roles.push(...roles);
        return user.save();
    }

    modelDef.schema.pre('save', function save(next){
        const user = this;
        if (!user.isModified('password')) { return next(); }
        bcrypt.genSalt(10, (err, salt) => {
          if (err) { return next(err); }
          bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
          });
        });
    })
    modelDef.schema.methods.generateAuthToken = async function(privateKey, signOptions, payload = {}){
        /*  extra data to be sent back to user is an object = { scopes: [], user_type: ''}
        **   and any extra information the system might need
        */
        
        signOptions.subject = this._id.toString();
        return await jwt.sign(payload, privateKey, signOptions);
    }
    modelDef.schema.methods.comparePassword = function comparePassword(candidatePassword, cb){
            bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            cb(err, isMatch);
          });
    }

    return mongoose.model(modelDef.name, modelDef.schema)
}