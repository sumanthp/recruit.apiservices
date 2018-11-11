var User = require('../models/user');
var jwt = require('jwt-simple');
var moment = require('moment');
module.exports= {
    register: function (req, res) {
        console.log(req.body);
        User.findOne({email: req.body.email}, function(err, existingUser){
            if(existingUser)
            {
                console.log("Email already exists in the database");
                return res.status(409).send({message:"Email is already registered"});
            }
            var user = new User(req.body);
            user.save(function (err, result) {
                if (err) {
                    res.status(500).send({
                        message: err.message
                    });
                }
                res.status(200).send({message: "User Registered Successfully", token: createToken(result)});
            })
        });
    },

    login: function (req, res) {
        console.log(req.body);
        User.findOne({email: req.body.email}, function(err, user){
           if(!user){
                console.log("Invalid Email or password");
                return res.status(401).send({message: "Email or Password Invalid"});
           }
           if(req.body.password === user.password){
               console.log(req.body, user.password);
               res.send({
                  token : createToken(user)
               });
           }
           else{
               console.log("Email or Password is wrong");
               return res.status(401).send({message:"Failed to Authenticate User.Try again"});
           }
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