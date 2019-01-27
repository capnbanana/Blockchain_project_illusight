var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

router.get('/', function(req, res){
    res.render('home/index');
});

//login view 보여주는 router
router.get('/login', function(req, res){
    var userId = req.flash('userId')[0];
    var errors = req.flash('errors')[0] || {};
    res.render('home/login', {
        userId: userId, //비번 틀리고 새로고침 됐을때 아이디 다시 없어지지 않게?
        errors:errors
    });
});



//login form에서 보내진 post request 처리해 주는 router
//첫번째 callback : 보내진 form의 validation을 위한 것. 에러 있으면 flash만들고 login view로 redirect.
//두번째 callback : passport local strategy 호출해서 authentication(로그인) 진행.
router.post('/login', function(req, res, next){
    var errors = {};
    var isValid = true;
    if(!req.body.userId){
        isValid = false;
        errors.userId = 'User ID is required!';
    }
    if(!req.body.password){
        isValid = false;
        errors.password = 'Password is required!';
    }
    if(isValid){
        next();
    } else {
        req.flash('errors ', errors);
        res.redirect('/login');
    }
},
passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
}
));

//passport에서 제공된 req.logout 함수를 사용하여 로그아웃.
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});



module.exports = router;