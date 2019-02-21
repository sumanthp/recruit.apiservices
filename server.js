var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var auth = require('./controllers/auth');
var passport = require('passport');
//var social = require('./passport/passport')(app,passport);
var session = require('express-session');
var jwt = require('jsonwebtoken');
FacebookStrategy = require('passport-facebook').Strategy;
var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyD-ntzQCkESWnRBQRXIRx5y3xO-k2Yqouw",
    authDomain: "recruit-5fa61.firebaseapp.com",
    databaseURL: "https://recruit-5fa61.firebaseio.com",
    storageBucket: "recruit-5fa61.appspot.com",
};


firebase.initializeApp(config);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req,res,next){
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "x-auth, Content-Type, Authorization, x-access-token");
   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});

app.use(session(
    {
        secret: 'keyboard cat',
        resave:false,
        saveUninitialized:true,
        cookie:{secure:false}
    }
    ));
app.use(passport.initialize());
app.use(passport.session());
app.route('/api/login').post(auth.login);
app.route('/api/register').post(auth.register);
app.route('api/register/recruiter').post(auth.register_recruiter)
app.route('/api/facebook/login').post(auth.facebook);
app.route('/api/google/login').post(auth.google);
app.route('/api/linkedin/login').post(auth.linkedin);
app.route('/api/getUserDetails').post(auth.getUserDetails);
app.route('/api/google/login/redirect').get(auth.googleLoginRedirect);
app.route('/verifyEmail').get(auth.validateEmailLink);
passport.use(new FacebookStrategy({
    clientID:"912201792307025",
    clientSecret:"",
    callbackURL:"",
    profileFields: ['id', 'displayName', 'email']
},
function(accessToken, refreshToken, profile, cb){
    // User.findOrCreate({facebookId: profile.id}, function(err,user){
    //     return cb(err,user);
    // })
    User.findOne({email: profile._json.email}).select('name password email').exec(function(err, user){
        if(err){
            cb(err);
        }
        if(user && user!=null){
            cb(null,user);
        }else{
            cb(err);
        }
    });
    console.log(profile);
    cb(null, profile);
}));
passport.serializeUser(function(user,cb){
    token = jwt.sign({username: user.name, email: user.email}, secret, {expiresIn: '24h'});
    cb(null,user.id);
});
passport.deserializeUser(function(obj,cb){
    cb(null,obj);
});
app.route('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect:'/login'}), function(req, res){
    // res.redirect('/facebook/' + token);
    res.send(token);
});
app.route('/auth/facebook').post(passport.authenticate('facebook'));
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