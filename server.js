var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database;
var cors = require('cors');
var auth = require('./controllers/auth');
var corsOptions = {
    origin: 'http://localhost:5000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
//app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req,res,next){
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "x-auth, Content-Type, Authorization");
   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
   next();
});
app.route('/api/login').post(auth.login);
app.route('/api/register').post(auth.register);

mongoose.connect("mongodb://localhost:27017/Account",  { useNewUrlParser: true }, function(err,db){
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