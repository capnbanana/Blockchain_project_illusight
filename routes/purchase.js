var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Masterpiece = require('../models/masterpiece');
var User = require('../models/user');
var async = require('async');


//로그인 안됐을때
router.get('/', function(req, res){
    res.render('purchase/purchaseList', {masterpiece: 'null'});

});

//로그인 된 상태
router.get('/:userWalletAddr', function(req, res){
    console.log(req.params.userWalletAddr);

    User.findOne({walletAddr: req.params.userWalletAddr}, function(err, user){
        if(err) res.json(err);
        var purchasedList = user.purchasedList;
        console.log('purchasedList >>>>> ', purchasedList);
        var purchasedMasterpiece = [];
        async.each(purchasedList, function(itemTxhash, cb){
            console.log(itemTxhash)
            Masterpiece.find({txhash: itemTxhash}, function(err, rows){
                if (err) res.json(err);
                console.log(rows);
                purchasedMasterpiece.push(rows[0]);
                cb(err);
            });
        }, function(err){
            if(err) res.json(err);

            console.log(purchasedMasterpiece);
            res.render('purchase/purchaseList', {masterpiece: purchasedMasterpiece})
        })
    });

});

//purchaseList Detail
router.get('/api/:masterpieceId', function(req, res){
    console.log('hellllllooooo')
    Masterpiece.findOne({_id: req.params.masterpieceId}, function(err, masterpiece){
        if(err) return res.json(err);
        User.findOne({walletAddr: masterpiece.author}, function(err, user){
            if(err) return res.json(err);
            res.render('purchase/purchaseListDetail', {user:user, masterpiece:masterpiece});
        })
        
    });
});


module.exports = router;