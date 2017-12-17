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

/*

var serverInfoFile = configReader.rootPath() + '\config\config.json';
var port = jf.readFile(serverInfoFile, function (err, currentServerInfo) {
		var serverInfo = currentServerInfo;
		console.log(serverInfoFile);
		var st = serverInfo.port;
		return st;
	});
console.log(port);


*/




exports.createServerInfo = function(portset) {
    if (!fs.existsSync(configReader.rootPath() + "/servers/serverInfo.json")) {
		var setram = 256;
		//we must recall 
        var serverInfoComplete = {
            porttrack: 25590,
			defserver: "server1112",
			defram: setram
        }
		jf.writeFile(configReader.rootPath() + "/servers/serverInfo.json", serverInfoComplete, function (err) {
			if(!err){
				console.log("creating serverInfo file...");
			}else{
				console.log("can not place serverInfo file...");
				console.log(err);
			}
		});
	}else{
		var setram = 257;
        var serverInfoComplete = {
            porttrack: portset,
			defserver: "server1112",
			defram: setram
        }
		jf.writeFile(configReader.rootPath() + "/servers/serverInfo.json", serverInfoComplete, function (err) {
			if(!err){
				console.log("serverInfo file set...");
			}else{
				console.log(err);
		    }
		});
	}
}

exports.amserverset = function(username, password, amserver, yesnoset,edit){
	var dir = configReader.rootPath() + "/servers/" + username;
	
        var serversetconfig = {
            amofserver: amserver,
			password: password,
			didserversbeset: yesnoset
        }
	console.log(amserver);
	if (!fs.existsSync(dir) && edit == true){
		fs.mkdirSync(dir);
		jf.writeFile(dir + "/serversetconfig.json", serversetconfig, function(err){
			if(err){
				console.log(err);
			}
		});
	} else if(fs.existsSync(dir) && edit == true){
		jf.writeFile(dir + "/serversetconfig.json", serversetconfig, function(err){
			if(err){
				console.log(err);
			}
		});
	}else{
		console.log("this acc didn't have access: [" + username + "]");
	}
}

	//Copying the files default server.jar to the user server folder
exports.createserver = function(username, server_Id, server_ver) {
	var dir2 = configReader.rootPath() + "/servers/" + username + "/" + username + server_Id;
	var dir = configReader.rootPath() + "/servers/" + username;
    if (!fs.existsSync(dir) || !fs.existsSync(dir2)) {
			fs.mkdirSync(dir);
            fs.mkdirSync(dir2);
            var serverFolder = path.join(dir2);
            var copyServer = fs.createReadStream(configReader.rootPath() + '/serverVersions/' + server_ver + '.jar').pipe(fs.createWriteStream(serverFolder + '/' + server_ver + '.jar'));
			copyServer.on('finish', function () {
				console.log("server file " + server_ver + ".jar is finish");
			});
		}else{
            var serverFolder = path.join(dir2);
            var copyServer = fs.createReadStream(configReader.rootPath() + '/serverVersions/' + server_ver + '.jar').pipe(fs.createWriteStream(serverFolder + '/' + server_ver + '.jar'));
			copyServer.on('finish', function () {
				console.log("server file " + server_ver + ".jar is finish");
			});
    }
}
	
	
	
exports.createproperties = function(username, server_Id, setram, servertype, resetproperties) {
	var dir = configReader.rootPath() + "/servers/" + username;				
	var dir2 = dir + "/" + username + server_Id;

	var serverInfoFile = configReader.rootPath() + '/servers/serverInfo.json'
		var servername = "no name"
	    jf.readFile(serverInfoFile, function (err, currentServerInfo) {
			if(resetproperties == true || !resetproperties == null){
				var serverInfo = currentServerInfo;
				var port = serverInfo.porttrack;
				var server_ver = serverInfo.server;
				port = port + 1;
				console.log(port);
				if(err){
					console.log(err)
				}
				var serverInfo = {
					serverid: server_Id,
					port: port,
					server: servertype,
					ram: setram,
					servername: servername
				}
				exports.createServerInfo(port);
				var properties = "#Minecraft server properties \n" +
							"#Thu Mar 23 20:49:11 CET 2017 \n" +
							"generator-settings= \n" +
							"force-gamemode=false \n" +
							"allow-nether=true \n" +
							"gamemode=0 \n" +
							"enable-query=false \n" +
							"player-idle-timeout=0 \n" +
							"difficulty=1 \n" +
							"spawn-monsters=true \n" +
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
						
				if (!fs.existsSync(dir2)) {
					fs.mkdirSync(dir);
					fs.mkdirSync(dir2);
					fs.writeFile(dir2 + "/server.properties", properties, function (err) {
						if (err) {
							return console.log(err);
						}
					
					
						jf.writeFile(dir2 + "/serverInfo.json", serverInfo, function (err) {
							if (err) {
								return console.log(err);
							}
							console.log("properties was set for " + username);
							
						});
					});
				}else{					
					fs.writeFile(dir2 + "/server.properties", properties, function (err) {
						if (err) {
                        return console.log(err);
						}
					
					
						jf.writeFile(dir2 + "/serverInfo.json", serverInfo, function (err) {
							if (err) {
								return console.log(err);
							}
							console.log("properties was set for " + username);
							
						});
					});
				}
			}else{
				jf.readFile(configReader.rootPath() + "/servers/" + username + "/" + username + server_Id + "/serverInfo.json", function (err, cServerInfo) {
					var serverInfo = cServerInfo;
					var port = serverInfo.port;
				
					var properties = "#Minecraft server properties \n" +
								"#Thu Mar 23 20:49:11 CET 2017 \n" +
								"generator-settings= \n" +
								"force-gamemode=false \n" +
								"allow-nether=true \n" +
								"gamemode=0 \n" +
								"enable-query=false \n" +
								"player-idle-timeout=0 \n" +
								"difficulty=1 \n" +
								"spawn-monsters=true \n" +
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
						
					if (!fs.existsSync(dir2)) {
						fs.mkdirSync(dir);
						fs.mkdirSync(dir2);
						fs.writeFile(dir2 + "/server.properties", properties, function (err) {
							if (err) {
								return console.log(err);
							}
							});
					}else{					
						fs.writeFile(dir2 + "/server.properties", properties, function (err) {
							if (err) {
								return console.log(err);
							}

						});
					}
				});
			}
	});
}