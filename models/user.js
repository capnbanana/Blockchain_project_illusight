var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;


var userSchema = new Schema({
    userId: {type: String, required: [true, 'User ID is required!'], unique: true}, //배열 사용해서 custom 에러 메세지 만들 수 있음.
    password: {type: String, required: [true, 'Password is required!'], select: false}, //기본설정은 schema항목을 db에서 읽어옴. false로 설정할 경우 db에서 읽어오라고 할때만 읽어옴.
    username: {type: String, required: [true, 'Name is required!']},
    email: {type: String},
    walletAddr: {type: String, unique:true},
    profilePic: {type: String},
    purchasedList: [],
    buyersOfMyWork: []
},{
    toObject:{virtuals:true}
});


// var userSchema = new Schema({
//     userId: String, //배열 사용해서 custom 에러 메세지 만들 수 있음.
//     password: String,
//     username: String,
//     email: String
// },{
//     toObject:{virtuals:true}
// });

//virtual. 다큐먼트에는 없지만 객체에 있는 가상의 필드를 만들어줌.
userSchema.virtual('passwordConfirmation')
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

//password validation
//db에 정보를 생성, 수정하기 전에 mongoose가 값이 유효한지 확인하는데
//password항목에 사용자정의 validation함수를 정의할 수 있음.
//virtual들은 직접 validation이 안되기 때문에(db값을 저장하지 않으니까!) password에서 값을 확인하도록 함.
userSchema.path('password').validate(function(v){
    var user = this; //validation callback 함수에서 this는 user model임.

    //create user
    if(user.isNew){
        if(!user.passwordConfirmation){
            user.invalidate('passwordConfirmation', 'Password Confirmation is requirec!');
        }
        if(user.password !== user.passwordConfirmation){
            user.invalidate('passwordConfirmation', 'Password Confirmation does not match!');
        }
    }

    //update user
    if(!user.isNew){
        if(!user.currentPassword){
            user.invalidate('currentPassword', 'Current Password is required!');
        }
        if(user.currentPassword && user.currentPassword != user._originalPassword){
            user.invalidate('currentPassword', 'Current Password is invalid');
        }
        if(user.newPassword !== user.passwordConfirmation){
            user.invalidate('passwordConfirmation', 'Password Confirmation does not match!');
        }
    }
});



module.exports = mongoose.model('user', userSchema);


