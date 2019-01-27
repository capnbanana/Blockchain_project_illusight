var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Masterpiece = require('../models/masterpiece');
var User = require('../models/user');

//아티스트 리스트 출력
router.get('/', function(req, res){
    User.find({})
    .sort({userId:1})
    .exec(function(err, users){
        if (err) return res.json(err);
        res.render('artists/Artists', {users:users})
    });
});

//아티스트 작품 모아보기
router.get('/:userObjId/:walletAddr', function(req, res){
    console.log(req.params.userObjId);
    console.log(req.params.walletAddr);
    Masterpiece.find({author: req.params.walletAddr}, function(err, masterpiece){
        if(err) return res.json(err);
        User.findOne({_id: req.params.userObjId}, function(err, user){
            if(err) return res.json(err);

            res.render('artists/ArtistCollection', {user:user, masterpiece:masterpiece});
        })
        
    })
});

//아티스트 작품 상세보기
router.get('/:masterpieceId', function(req, res){
    Masterpiece.findOne({_id: req.params.masterpieceId}, function(err, masterpiece){
        if(err) return res.json(err);
        User.findOne({walletAddr: masterpiece.author}, function(err, user){
            res.render('artists/ArtistCollectionDetail', {user:user, masterpiece:masterpiece});
        });
        
    });
});


//ArtistCollectionDetail에서 구매 눌렀을때
router.post('/purchaseArtWork', function(req, res){
    console.log('hello');
    User.findOne({walletAddr: req.body.buyer}, function(err, user){
        if(err) return res.json(err);
        user.purchasedList.push(req.body.infoOnBlockchain);

        user.save(function(err, db){
            if(err) return res.json(err);
            console.log('db >>>>>>>>>> ' + db);
        });
    });
    User.findOne({walletAddr: req.body.authorWallletAddress}, function(err, user){
        if(err) return res.json(err);
        user.buyersOfMyWork.push(req.body.buyer);

        user.save(function(err, db){
            if(err) return res.json(err);
            console.log('db >>>>>>>>>> ' + db);
        })

    })

    User.f
})




module.exports = router;