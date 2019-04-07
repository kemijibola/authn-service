var express = require('express');
var router = express.Router();
const Users = require('../controllers/users');
const lib = require('../lib');


router.get('/', function(req,res,next) {
    new Users(lib).index(req,res);
    
    // console.log('index called');
    
});

router.post('/users', function( req,res,next) {
    req.nickname = 'addUser';
    new Users(lib).signup(req,res,next);
});

module.exports = router;
