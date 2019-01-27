var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


// login시 db에서 발견한 user를 어떻게 session에 저장할지 정하는 부분. 
// user정보 전체를 세션에 저장하면 사이트 성능이 떨어지거나, 
// user object가 변경되면 변경된 부분이 반영되지 못하므로 user의 id만 session에 저장
passport.serializeUser(function(user, done){ 
    done(null, user.id);
});

//request시에 세션에서 어떻게 user object를 만들지 정하는 부분
//매번 request마다 user정보를 db에서 새로 읽어오기 때문에
//user가 변경되면 바로 변경된 정보가 반영오디는 장점이 있음.
//다만 매번 request마다 db를 읽게 되는 단점이 있는데 선택은 상황에 맞게 하면됨.
passport.deserializeUser(function(id, done){
    User.findOne({_id:id}, function(err, user){
        done(err, user);
    });
});

//로그인 form의 username과 password항목의 이름이 다르다면 여기서 값 변경해주면 됨.
//예를들어, 로그인 항목인 form의 항목이름이 email,pass라면 usernameField: 'email', .... 이런식으로!
//로그인시에 이 함수가 호출됨.
//db에서 해당 user를 찾고, user model에 설정했던 user.authenticate함수를 사용해서 입력받은 password와 저장된 password hash를 비교해서 값이 일치하면,
//해당 user를 done에 담아서 return.
//그렇지 않은 경우 username flash와 에러 flash 생성 후 done에 false를 담아 return.
//user.authenticate(password)는 
//입력받은 password와 db에서 읽어온 해당 user의 password hash를 비교하는 함수 !!!!!! 나중에 만들기!!!
passport.use('local-login',
    new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, userId, password, done){
        User.findOne({userId: userId})
        .select({password:1})
        .exec(function(err, user){
            if(err) return done(err);

            // if (user && user.authenticate(password)){
            if(user.password == password){
                return done(null, user); //done의 첫번째 parameter는 항상 error를 담기 위한 것으로 error가 없다면 null을 담는다.
            } else {
                req.flash('userId', userId);
                req.flash('errors', {login: 'Incorrect user id or password'});
                return done(null, false);
            }
        });
    })
);

module.exports = passport;