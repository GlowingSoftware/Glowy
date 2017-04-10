console.log("Starting...");
var path = require('path');
var jf = require('jsonfile'); //NPM INSTALL
var proc = require('child_process');
var filePathINI = path.join(__dirname, 'ini.json');
var filePathOFF = path.join(__dirname, 'stop.json');
var fs = require('fs');
var express = require('express'); //NPM INSTALL
var copy = require('copy'); //NPM INSTALL
var http = require('http');
//SOCKET IO NPM INSTALL
var app = express();
var serv = require('http').createServer(app);

serv.listen(8081);
var io = require('socket.io')(serv,{});
console.log("Servidor initialized");
io.sockets.on('connection', function(socket){
   socket.on('quieroMiLista', function(name) { //quieroMiLista means I want my List
        var plugins = [];
        var count = 0;
        var folder = '/var/www/html/servers/' + name + '/plugins/';
        fs.readdir(folder, (err, files) => {
           socket.emit('tuLista', files); //tulista means Your List
        })
   });
   socket.on('quieroUnaCarpeta', function(name, folderName){ //I want a folder
       var plugins = [];
       var count = 0;
       var folder = '/var/www/html/servers/' + name + '/plugins/' + folderName;
       fs.readdir(folder, (err, files) => {
           socket.emit('tuCarpeta', files); //Your folder
        })
   });
   socket.on("installPlugin", function(name, url, pluginName){ //This doesnt need an explanation
        installPlugin(name, url, pluginName);
   });
   socket.on("deletePlugin", function(name, pluginName){
       deletePlugin(name, pluginName);
   });
   socket.on('leerConfig', function(name, folderName, fileName){ //Read the config
       var fileName = '/var/www/html/servers/' + name + '/plugins/' + folderName + '/' + fileName;
       fs.readFile(fileName, 'utf8', function(err, data) {
            if (err) throw err;
            //Packet name is in Spanglish (Spanish + English)
            socket.emit('tuFile', data, folderName, fileName); //Your config file
        });
   });
   socket.on('save-file', function(data, name, folder, file){
        saveFile(data, name, folder, file)
   });
});

function installPlugin(name, url, pluginName){
    var dir = path.join(__dirname, '/servers/' + name + '/' + 'plugins' + '/' + pluginName);
    var file = fs.createWriteStream(dir);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);  // close() is async, call cb after close completes.
        });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
}
function deletePlugin(name, pluginName){
    var dir = path.join(__dirname, '/servers/' + name + "/plugins/" + pluginName);
    fs.unlinkSync(dir);
}
function saveFile(data, name, folder, file){
    var fileName = path.join(file);
    fs.writeFile(fileName, data, (err) => {
        if (err) throw err;
    });
};
