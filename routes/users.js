var express = require('express');
var router = express.Router();
// var passport = require('../config/passport');
var User = require('../models/user');

//업로드파일 uploads 폴더에 저장
var multer = require('multer');
var crypto = require('crypto');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/userProfilePic/')
    },
    filename: function(req, file, cb){
        var fileNameSplit = file.originalname.split('.'),
            fileOriginalName = fileNameSplit[0],
            fileExtension = fileNameSplit[1],
            randomNum = crypto.randomBytes(18).toString('hex');
        cb(null, fileOriginalName + '_' + randomNum + '.' + fileExtension)
    }
})
var upload = multer({storage: storage});



//모든 유저 보기
router.get('/', function(req, res){
    User.find({})
    .sort({userId:1})
    .exec(function(err, users){
        if (err) return res.json(err);
        res.render('users/index', {users:users});
    });
});

//회원가입
router.get('/new', function(req, res){
    var user = req.flash('user')[0] || {};
    var errors = req.flash('errors')[0] || {};
    res.render('users/new', {user: user, errors: errors});
});

//회원생성 create
router.post('/', function(req, res){
    console.log(req.body);

    User.create(req.body, function(err, user){
        console.log(req.body);
        if(err) return res.json(err);
        res.redirect('/users');
    });

});

//show User Info
router.get('/:userId', function(req, res){
    User.findOne({userId: req.params.userId}, function(err, user){
        if(err) return res.json(err);
        res.render('users/userInfo', {user:user});
    });
});

//edit
router.get('/:userId/edit', function(req, res){
    var user = req.flash('user')[0];
    var errors = req.flash('errors')[0] || {};

    if(!user){
        User.findOne({userId:req.params.userId}, function(err, user){
            if(err) return res.json(err);
            res.render('users/edit', {userId: req.params.userId, user:user, errors: errors}); 
        });
    } else {
        res.render('users/edit', {userId: req.params.userId, user:user, errors:errors});
    }

    // User.findOne({userId: req.params.userId}, function(err, user){
    //     if(err) return res.json(err);
    //     res.render('users/edit', {user:user});
    // });
});

//update
router.put('/:userId', function(req, res, next){
    console.log('got');
    // console.log('got')
    // User.findOne({userId: req.params.userId}) //sort함수 넣어주기 위해 callback없이 괄호 닫힘.
    // .select({'password':1})
    // .exec(function(err, user){
    //     if(err) return res.json(err);

    //     //update user object
    //     user.originalPassword = user.password;
    //     user.password = req.body.newPassword? req.body.newPassword : user.password;
    //     for(var p in req.body){
    //         user[p] = req.body[p];
    //     }

    //     //save updated user
    //     user.save(function(err, user){
    //         if(err) {
    //             req.flash('user', req.body);
    //             req.flash('errors', parseError(err));
    //             return res.redirect('/users/'+req.params.userId+'/edit');
    //         }
    //         res.redirect('/users/' + User.userId);
    //     });
    // });
});


module.exports = router;


// functions
function parseError(errors){
    var parsed = {};
    if(errors.name == 'ValidationError'){
      for(var name in errors.errors){
        var validationError = errors.errors[name];
        parsed[name] = { message:validationError.message };
      }
    } else if(errors.code == "11000" && errors.errmsg.indexOf("userId") > 0) {
      parsed.username = { message:"This username already exists!" };
    } else {
      parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
  }