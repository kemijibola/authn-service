const mongoose = require("mongoose");
const jsonSelect  = require('mongoose-json-select');
const helpers = require("../lib/helpers");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

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
    modelDef.schema.statics.addRoles = function(id, roles){
        const user = this.findById(id);
        roles.map(r => {
            user.roles.push(r);
        });
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
    modelDef.schema.methods.generateAuthToken = function(privateKey, signOptions, scopes = []){
        // the extra data to be sent back to user
        // user_id => sub
        // scopes = []
        return jwt.sign(scopes, privateKey, signOptions);
    }
    modelDef.schema.methods.comparePassword = function comparePassword(candidatePassword, cb){
            bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            cb(err, isMatch);
          });
    }

    return mongoose.model(modelDef.name, modelDef.schema)
}