var express = require('express');
var fs = require('fs');
var path = require('path');
var jf = require('jsonfile');
var copy = require('copy');
var app = express();
var serv = require('http').createServer(app);
var mysql = require('mysql');
var configReader = require('../../configReader')
var userManager = require('../userControllers/userManager')
var startQueue = {};
var config = configReader.readConfig();
var serversetting = require('../fileBuilders/server_setting')
var serv = require('http').createServer(app);



serv.listen(8084);
console.log("Serversetup initialized");


var io = require('socket.io')(serv, {});

io.sockets.on('connection', function (socket) {
	socket.on('createservers', function (name, amofserver, ch_ram, idk, idk) { /*ch_ram is if this acc can or can not change the ram on the servers*/
		var servername = name + serverId;
        var server = map.get(servername);
		console.log("get status");
        if (server != null) {
            socket.emit("statusON"); //server status ON
			console.log("status on");
        } else {
            socket.emit("statusOFF"); //server status OFF
			console.log("status off");
        }
    });
	
	
});


//random password generator with an encryption
//a for Loop that sets up all files for each server
//quest system for getting server type and ver