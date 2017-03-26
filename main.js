// All the things we'll use
var express = require('express');
var app = express();
var ejs = require('ejs');
var port = 80;
var serv = require('http').createServer(app);

//Initializing all the modules
//var servercreation = require('./servercreation');
var servercreator = require('./servercreator');
var servercontrol = require('./servercontrol');
//var plugins = require('./plugins');

// Ficheros estaticos en localhost/...
app.use(express.static('public'));
// Definimos sistema de plantillas
app.set('view engine', 'ejs');
// Metodos Gets
// Index
app.get('/', function(req,res){
    res.render('index');
});
// Registro
app.get('/register', function(req,res){
    res.render('register');
});
// Login
app.get('/login', function(req,res){
    res.render('login');
});
app.get('/server', function(req,res){
    res.render('server');
});
app.get('/logout', function(req,res){
    res.render('logout');
});
// Puerto 
app.listen(port);