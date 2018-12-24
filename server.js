var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var auth = require('./controllers/auth');
var passport = require('passport');
var social = require('./passport/passport')(app,passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req,res,next){
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "x-auth, Content-Type, Authorization, x-access-token");
   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
   next();
});
app.route('/api/login').post(auth.login);
app.route('/api/register').post(auth.register);
app.route('/api/facebook/login').post(auth.facebook);
app.route('/api/google/login').post(auth.google);
app.route('/api/linkedin/login').post(auth.linkedin);
app.route('/api/getUserDetails').post(auth.getUserDetails);
// mongodb://sumanth:Polisetty5@ds211694.mlab.com:11694/account
//mongoose.connect("mongodb://localhost:27017/Account",  { useNewUrlParser: true }, function(err,db){
mongoose.connect("mongodb://sumanth:Polisetty5@ds211694.mlab.com:11694/account",  { useNewUrlParser: true }, function(err,db){
    if(!err){
        console.log("Successfully conencted to mongodb");
        database = db;
    }else{
        console.log("Failed to connect to Mongodb");
    }
});
var server = app.listen((process.env.PORT || 5000), function (req,res) {
    console.log("Listening on port",server.address().port);
});