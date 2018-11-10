var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database;
var User = require('./models/user');
app.use(bodyParser.json());
app.use(function(req,res,next){
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "x-auth, Content-Type, Authorization");
   next();
});
app.post('/api/login/user', function (request, response) {
    console.log(request.body);
    response.status(200);
});
app.post('/auth/register', function(req,res){
   console.log(req.body);
    var user = new User(req.body);
    user.save(function(err,result){
        if(err){
            res.status(500).send({
                message : err.message
            });
        }
        res.status(200);
    });
});
mongoose.connect("mongodb://localhost:27017/Account", function(err,db){
    if(!err){
        console.log("Successfully conencted to mongodb");
        database = db;
    }
});
var server = app.listen(5000, function () {
    console.log("Listening on port",server.address().port);
});