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
var serversetting = require('../fileBuilders/server_setting')
var startQueue = {};
var config = configReader.readConfig();

serv.listen(8083);
console.log("???");
var mysqlSettings = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

var connection = mysql.createConnection(mysqlSettings);
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('Success. Connected to MySQL as id ' + connection.threadId);
});
connection.end();

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.on('register', function (username, email, password, serverId) {
        userManager.register(username, email, password, function (allFine) {
            if (allFine == true) {
                socket.emit("register", true)
				//here we need to call a new dir to be build for the new acc.
				//we need to look if this acc can edit the amout of servers it has and ram for each one.
                //createServer(username, serverId) <---- this is being move to ServerSetupCreator.js
                createServer(username, serverId)
            } else {
                socket.emit("register", false)
            }
        })
    });
    socket.on('login', function (username, password) {
        userManager.login(username, password, function (allFine) {
            if (allFine == true) {
                socket.emit("loginSucess");
            } else {
                socket.emit("loginFail");
            }
        });
    });
    socket.on('isRegisterOpened', function () {
        var config = configReader.readConfig();
        socket.emit('isRegisterOpened', config.enableRegister)
    });
});
function createServer(username, server_Id) {
    if (!fs.existsSync(configReader.rootPath() + "/servers/serverInfo.json")) {
		var server_ver = 'server1112';
        var setram = 256;
        console.log("1")
		serversetting.createServerInfo();
		serversetting.createproperties(username, server_Id, setram, server_ver, true);
		serversetting.createserver(username, server_Id, server_ver, true); //(username, server_Id, server_ver)
		
    } else {
        console.log("2")
		var server_ver = 'server1112';
		var setram = 256;
		serversetting.createproperties(username, server_Id, setram, server_ver, true);
		serversetting.createserver(username, server_Id, server_ver, true);
    }
}