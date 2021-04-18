var express = require('express');
var router = express.Router();
const multer = require("multer");
var path = 'uploads/';
// var upload = multer({ dest: path })


var urlDB = 'mongodb+srv://thangbcph11219:Thang48211@cluster0.cqmov.mongodb.net/tinder';
const mongoose = require('mongoose');

mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("connected!!!");
});

var user = new mongoose.Schema({
  avatar: String,
  username: String,
  dob: String,
  emailsdt: String,
  gender:String,
  hobit:String,
  description:String
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/img/')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
    cb(null,file.originalname);
  }
})

var upload = multer({

  dest: path
  , storage: storage,
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});


router.get('/home', function(req, res, next) {
  var connectUsers = db.model('users', user);
  connectUsers.find({},
      function (error, users) {
        if (error) {
          res.render('home', {title: 'Express : Loi@@@@'})
        } else {
          res.render('home', {title: 'Express', users: users})
        }
      })
});

router.get('/:id', function(req, res, next) {
  var connectUsers = db.model('users',user);
  connectUsers.findOne({_id: req.params.id},null,null, function (error,result) {
    if (error) {
      console.log(error)
    } else {
     res.render('edit', {connectUsers:result});
    }
  })
});

router.post('/insertUser',upload.single('avatar'),function (req,res){
  var connectUsers = db.model('users',user);
  var run = connectUsers({
    avatar: req.file.originalname,
    username: req.body.username,
    dob: req.body.dob,
    emailsdt: req.body.emailsdt,
    gender: req.body.gender,
    hobit: req.body.hobit,
    description: req.body.description,
  }).save(function (error){
    if(error){
      res.render('home', { title: 'Express Loi' });
    }else{
      res.redirect('home');
    }
  })
})

router.post('/:id/edit', upload.single('avatar'), function (req, res) {
  var connectUsers = db.model('users', user);
  connectUsers.findByIdAndUpdate(req.params.id,
      {
        avatar: req.file.originalname,
        username: req.body.username,
        dob: req.body.dob,
        emailsdt: req.body.emailsdt,
        gender: req.body.gender,
        hobit: req.body.hobit,
        description: req.body.description,
      }, function (error){
        if (error) {
          console.log(error)
        } else {
          res.redirect('/home')
        }
      });
})

router.post('/:id',upload.single('avatar'),function (req,res){
  var connectUsers = db.model('users',user);
  var run = connectUsers.findByIdAndRemove(req.params.id,null,function (error){
    if(error){
      res.render('home', { title: 'Express Loi' });
    }else{
      res.redirect('home');
    }
  })
})

module.exports = router;
