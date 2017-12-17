// All the things we'll use
var express = require('express');
var nconf = require('nconf');
var os = require('os');
var configReader = require('./configReader')
var app = express();
var port = null;
var serversetting = require('./src/fileBuilders/server_setting')
var serv = require('http').createServer(app);

//Initializing all the modules
//var servercreation = require('./servercreation');
var servercreator = require('./src/serverControllers/serverCreator.js');
var servercontrol = require('./src/serverControllers/serverControl.js');
var servercontrol = require('./src/serverControllers/ServerSetupCreator.js');

app.use(express.static('public'));
app.use('/bsjs', express.static(__dirname + '/src/vendor/bootstrap/js'));
app.use('/bscss', express.static(__dirname + '/src/vendor/bootstrap/css'));
app.use('/css', express.static(__dirname + '/src/vendor/css'));
app.use('/js', express.static(__dirname + '/src/vendor/js'));
app.use('/jquery', express.static(__dirname + '/src/vendor/jquery'));
app.use('/popper', express.static(__dirname + '/src/vendor/popper'));
app.use('/fonts', express.static(__dirname + '/src/vendor/fonts'));
app.use('/images', express.static(__dirname + '/src/vendor/images'));
	app.set('view engine', 'ejs');
	app.get('/', function(req,res){
    res.render('index');
});
app.get('/loader', function(req,res){
    res.render('loader');
});
app.get('/register', function(req,res){
    res.render('register');
});
app.get('/login', function(req,res){
    res.render('login');
});
app.get('/Control', function(req,res){
    res.render('Control');
});
app.get('/server', function(req,res){
    res.render('server');
});
app.get('/serverbulder', function(req,res){
    res.render('serverbulder');
});
app.get('/logout', function(req,res){
    res.render('logout');
});
// Port 
port = nconf.file({ file: 'config/config.json' }).get('port');
app.listen(port);
console.log("listen on " + port);

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

var ramtotal = bytesToSize(os.totalmem());

console.log(ramtotal);

//serversetting.amserverset("soul","adjanisdjnqwi",5,true);
//serversetting.createproperties("sasd", "as", 1212, "server1112", false);
//var numberOfSockets = Object.keys(socketIO.connected).length;