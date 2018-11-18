var User = require('../models/user');
var jwt = require('jwt-simple');
var moment = require('moment');
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
};

function createToken(user){
    var payload = {
        sub : user._id,
        iat: moment().unix(),
        exp: moment().add(15, 'days').unix()
    };
    return jwt.encode(payload, 'secret');
}
function validatePassword(req, user, res){
    bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result){
            console.log(req.body.email, user.password);
            res.status(200).send({
                message: "Welcome back "+req.body.email,
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
                res.status(200).send({message: "User Registered Successfully", token: createToken(result)});
            })
        }
    })
}