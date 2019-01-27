var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var passport = require('./config/passport');

var helmet = require('helmet');
var assert = require('assert');
var flash = require('connect-flash');
var async = require('async');
var fs = require('fs');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(express.json()); //<========post response
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//로그인 미들웨어 설정
app.use(flash());
var store = new MongoDBStore(
    {
        uri: 'mongodb://localhost/illusight',
        collection: 'mySessions'
    });

store.on('error', function(error){
    assert.ifError(error);
    assert.ok(false);
})

app.use(session({
    secret: '!@#MYSIGN!@#', //주기적으로 바꿔줄 것
    resave: false,
    saveUninitialized: true,
    store: store
}));

app.use(helmet.hsts({
    maxAge: 10886400000,
    includeSubdomains: true  //코딩 잘했는데 로그인이 안된다 싶으면 세션 미들웨어 설정이나 헬멧 미들웨어 설정을 잘못한거니 잘 살펴볼것
}))

//이 두줄은 항상 세션 설정보다 밑에 쓸것! 위에 써버리면 로그인한 정보가 세션이 저장안됨
app.use(passport.initialize()); //passport 초기화 시켜주는 함수
app.use(passport.session()); //passport를 session과 연결해주는 함수

app.use(function(req, res, next){ //req.locals에 담겨진 변수는 ejs에서 바로 사용가능!
    res.locals.isAuthenticated = req.isAuthenticated(); //passport에서 제공하는 함수. 현재 로그인 상태를 true, false로 리턴
    res.locals.currentUser = req.user; //passport에서 추가하는 항목. 로그인되면 session으로부터 user를 deserialize하여 생성
    next();
})


//PASSPORT
mongoose.Promise = global.Promise; //passport


//CONFIGURE MONGOOSE
//connect to mongodb server
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    //connected to mongodb server
    console.log('Connected to mongod server');
});

mongoose.connect('mongodb://localhost/illusight', { useNewUrlParser: true});

// Routes
app.use("/", require("./routes/home"));
app.use("/users", require("./routes/users"));
app.use("/artists", require("./routes/artists"));
app.use("/upload", require("./routes/upload"));
app.use("/myworks", require("./routes/myworks"));
app.use("/purchase", require("./routes/purchase"));
app.use("/buyToken", require("./routes/buyToken"));

//RUN SERVER
var port = process.env.PORT || 3000;
var server = app.listen(port, function(){
    console.log('Express server has started on port ' + port);
});