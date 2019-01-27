var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Masterpiece = require('../models/masterpiece');

//로그인 안됐을때
router.get('/', function(req, res){
    res.render('myWorks/myWorks', {masterpiece: 'null'});

});

//로그인 된 상태
router.get('/:userWalletAddr', function(req, res){
    console.log(req.params.userWalletAddr);
    Masterpiece.find({author: req.params.userWalletAddr}, function(req, masterpiece){
        res.render('myWorks/myWorks', {masterpiece: masterpiece});
    });

});



// router.get('/:userId', function(req, res){
//     Masterpiece.find({author: req.params.userId})
//     .sort({author:1})
//     .exec(function(err, masterpiece){
//         if (err) return res.json(err);
//         res.render('home/myWorks', {masterpiece:masterpiece});
//     });
// });

//show detail
router.get('/:userWalletAddr/:masterpieceId', function(req, res){
    Masterpiece.findOne({_id: req.params.masterpieceId}, function(err, masterpiece){
        if(err) return res.json(err);
        res.render('myWorks/myWorksDetail', {masterpiece:masterpiece});
    });
});

module.exports = router;


