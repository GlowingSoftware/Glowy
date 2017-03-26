var express = require('express');
var fs = require('fs');
var path = require('path');
var jf = require('jsonfile');
var copy = require('copy');
var app = express();
var serv = require('http').createServer(app);
var mysql = require('mysql');
var configReader = require('./configReader')
var userManager = require('./userManager')
//var db = require('./db.js');
var startQueue = {};

serv.listen(8081);
console.log("Servercreator initialized");
var mysqlSettings = {
    host: 'sql8.freemysqlhosting.net',
    user: 'sql8164855',
    password: 'vIaX9H4bp8',
    database: 'sql8164855'
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
    socket.on('register', function (username, email, password) {
        userManager.register(username, email, password, function (allFine) {
            if (allFine == true) {
                socket.emit("register", true)
                createServer(username)
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
function createServer(username) {
    if (!fs.existsSync("serverInfo.json")) {
        var serverInfoComplete = {
            port: 25590
        }
        jf.writeFile("serverInfo.json", serverInfoComplete, function (err) {
            var serverInfoFile = 'serverInfo.json'
            jf.readFile(serverInfoFile, function (err, currentServerInfo) {
                var serverInfo = currentServerInfo;
                var port = serverInfo.port;
                serverInfo.port = port + 1;
                jf.writeFile(serverInfoFile, serverInfo, function (err) {
                    var properties = "#Minecraft server properties \n" +
                        "#Thu Mar 23 20:49:11 CET 2017 \n" +
                        "generator-settings= \n" +
                        "force-gamemode=false \n" +
                        "allow-nether=true \n" +
                        "gamemode=0 \n" +
                        "enable-query=false \n" +
                        "player-idle-timeout=0 \n" +
                        "difficulty=1 \n" +
                        "spawn - monsters=true \n" +
                        "op-permission-level=4 \n" +
                        "announce-player-achievements=true \n" +
                        "pvp=true \n" +
                        "snooper-enabled=true \n" +
                        "level-type=DEFAULT \n" +
                        "hardcore=false \n" +
                        "enable-command-block=false \n" +
                        "max-players=20 \n" +
                        "network-compression-threshold=256 \n" +
                        "resource-pack-sha1= \n" +
                        "max-world-size=29999984 \n" +
                        'server-port=' + port + "\n" +
                        "debug=false \n" +
                        "server-ip= \n" +
                        "spawn-npcs=true";

                    fs.writeFile("server.properties", properties, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        var dir = "./servers/" + username;
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                            //Copying all the files to the user server folder
                            var serverFolder = path.join(__dirname, '/servers/' + username);
                            copy('server.jar', serverFolder, function (err, file) {
                            });
                            copy('server.properties', serverFolder, function (err, file) {
                            });
                            copy('serverInfo.json', serverFolder, function (err, file) {
                            });
                            //Delete the generated server.properties
                            fs.unlinkSync("server.properties");
                        }
                    });
                })
            })
        });
    } else {
        var serverInfoFile = 'serverInfo.json'
        jf.readFile(serverInfoFile, function (err, currentServerInfo) {
            var serverInfo = currentServerInfo;
            var port = serverInfo.port;
            serverInfo.port = port + 1;
            jf.writeFile(serverInfoFile, serverInfo, function (err) {
                var properties = "#Minecraft server properties \n" +
                    "#Thu Mar 23 20:49:11 CET 2017 \n" +
                    "generator-settings= \n" +
                    "force-gamemode=false \n" +
                    "allow-nether=true \n" +
                    "gamemode=0 \n" +
                    "enable-query=false \n" +
                    "player-idle-timeout=0 \n" +
                    "difficulty=1 \n" +
                    "spawn - monsters=true \n" +
                    "op-permission-level=4 \n" +
                    "announce-player-achievements=true \n" +
                    "pvp=true \n" +
                    "snooper-enabled=true \n" +
                    "level-type=DEFAULT \n" +
                    "hardcore=false \n" +
                    "enable-command-block=false \n" +
                    "max-players=20 \n" +
                    "network-compression-threshold=256 \n" +
                    "resource-pack-sha1= \n" +
                    "max-world-size=29999984 \n" +
                    'server-port=' + port + "\n" +
                    "debug=false \n" +
                    "server-ip= \n" +
                    "spawn-npcs=true";

                fs.writeFile("server.properties", properties, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    var dir = "./servers/" + username;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                        //Copying all the files to the user server folder
                        var serverFolder = path.join(__dirname, '/servers/' + username);
                        copy('server.jar', serverFolder, function (err, file) {
                        });
                        copy('server.properties', serverFolder, function (err, file) {
                        });
                        copy('serverInfo.json', serverFolder, function (err, file) {
                        });
                        //Delete the generated server.properties
                        fs.unlinkSync("server.properties");
                    }
                });
            })
        })
    }
}