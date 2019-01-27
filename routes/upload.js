var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Masterpiece = require('../models/masterpiece');

//업로드파일 uploads 폴더에 저장
var multer = require('multer');
var crypto = require('crypto');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/')
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
// var upload = multer({ dest: 'uploads/' });


//router 시작
router.get('/', function(req, res){
    res.render('home/upload');
});

router.post('/', upload.single('file'), function(req, res){
    console.log(req.file);
    console.log(req.body);

    var masterpiece = new Masterpiece();
    masterpiece.author = req.body.currentUser;
    masterpiece.title = req.body.title;
    masterpiece.price = req.body.price;
    masterpiece.fileAddr = req.file.filename;
    masterpiece.save(function(err, db){
        if (err){
            console.error(err);
            return;
        }
        console.log(db.id);
        // userUploadFileDB_id[req.body.currentUser] = db.id;
        // res.render('home/upload', {db_id: db.id});

        res.render('home/uploadDone',{test:db});
    })
});

router.post('/onBlockchain', function(req, res){
    console.log('final result!!!!!>>>>>>> ' + req.body);
    var test;
    Masterpiece.findOne({_id: req.body.id}, function(err, masterpiece){
        if(err) return res.json(err);
        masterpiece.txhash = req.body.txhash;

        masterpiece.save(function(err, db){
            if(err) return res.json(err);
            console.log('db >>>>>>>>>> ' + db);
        });
    });
    
    
})


// const userUploadFileDB_id = [];


// router.post('/:userId/:filename', function(req, res){
//     var masterpiece = new Masterpiece();
//     masterpiece.title = req.body.title;
//     masterpiece.author = req.body.author;
//     masterpiece.publishDate = req.body.publishDate;
//     masterpiece.fileAddr = req.body.filename;
//     masterpiece.txhash = req.body.txhash;
    
//     masterpiece.save(function(err){
//         if (err) {
//             console.error(err);
//             res.json({result:0});
//             return;
//         }
//         // res.json({result:1});
//         res.redirect('home/upload');
//     })
// });

module.exports = router;