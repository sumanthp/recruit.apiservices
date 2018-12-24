var User = require('../models/user');
var jwt = require('jwt-simple');
var moment = require('moment');
var passport = require('passport');
var passport_facebook = require('passport-facebook').Strategy;
var passport_google = require('passport-google');
var passport_linkedin = require('passport-linkedin');
const bcrypt = require('bcrypt');
module.exports= {
    register: function (req, res) {
        console.log(req.body);
        User.findOne({email: req.body.email}, function(err, existingUser){
            if(existingUser)
            {
                console.log("Email already exists in the database");
                return res.status(409).send({message:"Email is already registered"});
            }
            else{
                hashPassword(req, res);
            }
        });
    },

    getUserDetails: function(req, res){
        console.log("Get User Details API");
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if(!token){
            res.statusMessage = 'unauthorized: Token not found.';
            res.sendStatus('401').end();
        }else{
            try{
                 const decodeToken = jwt.decode(token, 'recruit');
                 res.status(200).send({succes:true, user:decodeToken});
            }catch(e){
                res.statusMessage = "unauthorized: invalid token.";
                res.sendStatus('401');
                return;
            }
        }
    },

    login: function (req, res) {
        console.log(req.body.email);
        User.findOne({email: req.body.email}, function(err, user){
           if(!user){
                console.log("Invalid Email or password");
                return res.status(401).send({message: "Email or Password Invalid"});
           }
           validatePassword(req, user, res);
        });
    },

    facebook: function(req, res){
        passport.use(new passport_facebook({
            clientID:"",
            clientSecret:"",
            callbackURL:""
        },
        function(accessToken, refreshToken, profile, cb){
            User.findOrCreate({facebookId: profile.id}, function(err,user){
                return cb(err,user);
            })
        }));
        passport.serializeUser(function(user,cb){
            cb(null,user);
        });
        passport.deserializeUser(function(obj,cb){
            cb(null,obj);
        });
    },

    google: function(req, res){
        passport.use(new passport_google({
            clientID: "827184650329-aurntqn7t2djnbv8e2m05jhtqb4vfeed.apps.googleusercontent.com",
            clientSecret:"nFmjopJDMDmqkLsF60qiWT7G",
            callbackURL:""
        },
        function(accessToken, refreshToken, profile, cb){
            User.findOrCreate({facebookId: profile.id}, function(err,user){
                return cb(err,user);
            })
        }));
        passport.serializeUser(function(user,cb){
            cb(null,user);
        });
        passport.deserializeUser(function(obj,cb){
            cb(null,obj);
        });
    },

    linkedin: function(req, res){
        passport.use(new passport_linkedin({
            clientID:"81u0oh0mys638l",
            clientSecret:"wDjHTNB4rzMtzQJv",
            callbackURL:""
        },
        function(accessToken, refreshToken, profile, cb){
            User.findOrCreate({facebookId: profile.id}, function(err,user){
                return cb(err,user);
            })
        }));
        passport.serializeUser(function(user,cb){
            cb(null,user);
        });
        passport.deserializeUser(function(obj,cb){
            cb(null,obj);
        });
    }
};

function createToken(user){
    var payload = {
        sub : user._id,
        name : user.name,
        email : user.email,
        iat: moment().unix(),
        exp: moment().add(24, 'hours').unix()
    };
    return jwt.encode(payload, 'recruit');
}
function validatePassword(req, user, res){
    bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result){
            console.log(req.body.email, user.password);
            res.status(200).send({
                message: "Welcome back "+user.name,
                token : createToken(user)
            });
        }
        else{
            console.log("Email or Password is wrong");
            return res.status(401).send({message:"Failed to Authenticate User.Try again"});
        }
    })
}
function hashPassword(req, res){
    bcrypt.hash(req.body.password, 10, function(err,hash){
        if(err){
            console.log("Failed to hash the password. Try again");
            req.status(500).send("Failed to encrypt data. Try again");
        }
        else{
            req.body.password = hash;
            var user = new User(req.body);
            user.save(function (err, result) {
                if (err) {
                    res.status(500).send({
                        message: err.message
                    });
                }
                res.status(200).send({message: "User Registered Successfully", token: createToken(user)});
            })
        }
    })
}