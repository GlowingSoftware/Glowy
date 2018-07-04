console.log("Starting...");
var nconf = require('nconf');
var path = require('path');
var exec = require('child_process').exec;
var configReader = require('../../configReader')
var filePathINI = path.join(__dirname, 'ini.json');
var filePathOFF = path.join(__dirname, 'stop.json');
var fs = require('fs');
var mc_server = null;
var HashMap = require('hashmap');
var map = new HashMap();
var jf = require('jsonfile');

var express = require('express');
//SOCKET IO NPM INSTALL
var app = express();
var serv = require('http').createServer(app);
var startQueue = {};
var xmax = "256";
var xmin = "256";

serv.listen(8082);
console.log("Server initialized");


var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.on('status', function (name, serverId) {
        var servername = name + serverId;
        var server = map.get(servername);
        console.log("get status");
        if (server != null) {
            socket.emit("statusON"); //server status ON
            //console.log("status on");
        } else {
            socket.emit("statusOFF"); //server status OFF
            //console.log("status off");
        }
    });
    socket.on('GetServersInfo', function (name) {
        var info = getServersInfoByName(name)
        socket.emit("ServersInfo", info);
    })
    socket.on('GetServerInfo', function (name, id) {
        var info = getServerInfoByName(name, id)
        socket.emit("ServerInfo", info);
    })
    socket.on('startServer', function (name, serverId) {
        var servername = name + serverId;
        console.log(servername)
        var server = map.get(servername);
        if (serverId != null && servername == name + serverId) {
            if (server == null) {
                var poth = configReader.rootPath + '/servers/' + name + "/" + servername;
                var server_info = configReader.readServerInfo(name + "/" + servername)
                if (server_info) {
                    var server_ver = server_info.server; //this is call out for server version
                    //nconf.argv().env({ lowerCase: true }).file({ file: 'servers/' + name + '/' + servername + '/serverInfo.json' });
                    //xmax = nconf.get('ram');
                    var serverInfoFile = configReader.rootPath() + '/servers/' + name + '/' + servername + '/serverInfo.json';
                    jf.readFile(serverInfoFile, function (err, currentServerInfo) {
                        var serverInfo = currentServerInfo;
                        xmax = serverInfo.ram;
                    });
                    var mc_server2 = exec('"java" -Xmx' + xmax + 'M -Xms' + xmin + 'M -Dcom.mojang.eula.agree=true -jar ' + server_ver + '.jar nogui', { cwd: path.resolve(process.cwd() + "/servers/" + name + "/" + servername) }, function (err, stdout, stderr) {
                        if (err) { console.log(err); socket.emit("statusOFF"); return; }
                    });
                    map.set(servername, mc_server2);
                    socket.emit("statusON");
                    console.log("Starting server of " + name + serverId + " with " + xmax + " of ram");
                } else {
                    socket.emit("wrong");
                }
            } else {
                console.log("can not run server for " + name + serverId);
                map.remove(servername);
            }
        } else {
            console.log("server did not have a id for " + name);
            map.remove(servername);
        }
    });

	/*    
	socket.on('setram', function (name, ram) {
        var server = map.get(name);
        if (server == null) {
			//var setramconfig = new Config('./servers/' + name + '/serverInfo.json');
			//assert.ok(setramconfig.s('server.port') === 4201);
			//configReader.readServerInfo(name).set('ram', ram);
			//function setram() {
			//	this.type = ram
			//}
			// new setram()
			nconf.argv().env({ lowerCase: true }).file({ file: 'servers/' + name + '/serverInfo.json' });
			//nconf.use('ram', { file: 'path/to/a-new/config-file.json' });
			nconf.remove('ram')
			nconf.add({'ram': ram})
			console.log('ram save: ' + nconf.get('ram'));
			console.log("server " + name + " have " + ram + "M of ram update")
        }
    });
	*/

    socket.on('command', function (name, serverId, cmd) {
        var servername = name + serverId;
        console.log(servername)
        var server = map.get(servername);
        console.log("packet received")
        if (server != null) {
            if (cmd == "stop") { //this is not the most efficient way but it works...
                server.stdin.write("stop\r");
                map.remove(servername);
                socket.emit("statusOFF");
                console.log("Closing server of " + servername);
            } else {
                console.log("else")
                if (cmd != null) {
                    console.log("In the server of " + servername + " this command was executed: " + cmd);
                    server.stdin.write(cmd + "\r");
                }
            }
        }
    });





    socket.on('controlstartup', function (name, serverId) {
        var server = map.get(servername);
        var servername = name + serverId;
        serveroutput(servername);
    });

    //control socket input and output
    socket.on('getIP', function (name, serverId) {
        var ip = getIP(name, serverId);
        if (ip) {
            socket.emit("ip", ip);
        } else {
            socket.emit("wrong");
        }
    });
    socket.on('stopServer', function (name, serverId) {
        var servername = name + serverId;
        //Hashmap saves the variable name and the username
        var server = map.get(servername);
        if (server != null) {
            var lelo = map.get(servername);
            lelo.stdin.write("stop\r");
            map.remove(servername);
            console.log("Closing server of " + servername);
            socket.emit("statusOFF");
        }
    });

    socket.on('stopAllServers', function () { //pararTodos means Stop All servers
        stopAllServers();
    });
    socket.on('getNumberOfServersByName', function (name) { //pararTodos means Stop All servers
        console.log(getNumberOfServersByName(name))
        socket.emit('numberOfServersByName', getNumberOfServersByName(name));
    });
    socket.on('allServers', function () { //see all the servers
        var todo1 = map.keys();
        var count1 = 0;
        var max2 = todo1.length;
        var mandar = [];
        while (count1 <= max2) {
            var paDecir = todo1[count1];
            if (paDecir != null) {
                mandar[count1] = paDecir;
            }
            count1++;
        }
        if (mandar != null) {
            socket.emit("todos", mandar); //sending all the servers in a list
        }
    });

    function serveroutput(servername) {
        var server = map.get(servername);
        server.stdout.on('data', function (data) { //Here is where the server output
            socket.emit("serveroutput", data);
        });
    }
});



function getNumberOfServersByName(name) {
    var id = 0;
    var poth = './servers/' + name + "/" + name + id;
    while (fs.existsSync(poth) == true) {
        id++;
        poth = './servers/' + name + "/" + name + id;
    }
    return id;
}
function getServersInfoByName(name) {
    var numberOfServers = getNumberOfServersByName(name) - 1
    var serversInfo = [];
    for (i = 0; i <= numberOfServers; i++) {
        var serverInfo = {
            id: i,
            ip: getIP(name, i),
            name: getServerName(name, i)
        };
        serversInfo.push(serverInfo)
    }
    return serversInfo;
}
function getServerInfoByName(name, serverId) {
    var serverInfo = {
        id: serverId,
        ip: getIP(name, serverId),
        name: getServerName(name, serverId)
    };
    return serverInfo;
}
//Stop the last server
function stopLastServer() {
    var todo = map.keys();
    if (todo.length == 3) { //hardcoded value of How many servers can be ran
        var paBorrar = todo[0];
        var lelo2 = map.get(todo[0]);
        if (lelo2 != null) {
            lelo2.stdin.write("stop\r");
            console.log("Closing server of " + paBorrar + " to save RAM");
            map.remove(paBorrar);
        }
    }
}
//Stop all the servers
function stopAllServers() {
    var todo = map.keys();
    var count = 0;
    var max = todo.length;
    while (count <= max) {
        var toDelete = todo[count];
        var lelo2 = map.get(toDelete); //lelo doesnt mean anything xD
        if (lelo2 != null) {
            lelo2.stdin.write("stop\r");
            console.log("Closing server of " + toDelete);
            map.remove(toDelete);
        }
        count++;
    }
}

function getIP(name, serverId) {
    var servername = name + serverId;
    var ip = configReader.readConfig();
    var port = configReader.readServerInfo(name + "/" + servername);
    if (port) {
        var ipWithPort = ip.ip + ":" + (port.port);
        return ipWithPort;
    } else {
        return null;
    }
}
function getServerName(name, serverId) {
    var info = configReader.readServerInfo(name + "/" + name + serverId);
    return info.servername;
}
