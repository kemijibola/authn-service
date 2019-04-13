module.exports = function(db){
    return {
        "Application": require('./application'),
        "UserType": require('./userType')(db),
        "User": require('./user')(db),
        "Role": require('./role')(db),
        "Key": require('./key')(db)
    }
}