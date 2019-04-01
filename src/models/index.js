module.exports = function(db){
    return {
        "AccountStatus": require('./accountStatus')(db),
        "User": require('./user')(db),
        "Role": require('./role')(db)
    }
}