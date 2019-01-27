var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Masterpiece = require('../models/masterpiece');
var User = require('../models/user');


router.get('/', function(req, res){
    res.render('buyToken/buyToken', {masterpiece: 'null'});

});


module.exports = router;