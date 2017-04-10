// All the things we'll use
var express = require('express');
var app = express();
var ejs = require('ejs');
var port = 80;
var serv = require('http').createServer(app);

//Initializing all the modules
//var servercreation = require('./servercreation');
var servercreator = require('./src/serverControllers/servercreator');
var servercontrol = require('./src/serverControllers/servercontrol');
//var plugins = require('./plugins');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get('/', function(req,res){
    res.render('index');
});
app.get('/register', function(req,res){
    res.render('register');
});
app.get('/login', function(req,res){
    res.render('login');
});
app.get('/server', function(req,res){
    res.render('server');
});
app.get('/logout', function(req,res){
    res.render('logout');
});
// Port
app.listen(port);