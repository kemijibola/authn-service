module.exports = function(db){
    return {
        "AccountStatus": require('./accountStatus')(db),
        "UserType": require('./userType')(db),
        "User": require('./user')(db),
        "Role": require('./role')(db),
        "Key": require('./key')(db)
    }
}