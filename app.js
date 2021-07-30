'use strict'

var mongo = require('mongodb');
var crypto = require('crypto');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//create database

//var MongoClient = mongo.MongoClient;

var url = "mongodb://localhost:27017/Userdb";

//var MongoClient = mongo(url);

var port = 3000;

app.get('/', function (req, res) {
    res.set({
        'Access-Control-Allow-Origin': '*'
    });
    return res.redirect('/public/main.html');
}).listen(port);
console.log("Server is listening at " + port);
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var getHash = (pass, phone) => {
    var hmac = crypto.createHmac('sha512', phone);
    //passing the data to be hashed
    var data = hmac.update(pass);
    //creating the required format
    var gen_hmac = data.digest('hex');
    //printing the output to the console
    console.log("hmac: " + gen_hmac);
    return gen_hmac;
}
app.post('/sign_up', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var pass = req.body.password;
    var password = getHash(pass, phone);

    var data = {
        "name": name,
        "email": email,
        "password": password,
        "phone": phone
    }
    mongo.connect(url, function (err, db) {
        if (err) throw err;
        console.log("Database Created Successfully");
        db.collection("details").insertOne(data, (err, collection) => {
            if (err) throw err;
            console.log("Record inserted successfuly");
            console.log(collection);
        });
    });
    console.log("DATA is " + JSON.stringify(data));
    res.set({
        'Access-Control-Allow-Origin' : '*'
    });
    return res.redirect('/public/success.html');
});