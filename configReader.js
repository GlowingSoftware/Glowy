var jf = require('jsonfile');
var path2 = require('path');

exports.readConfig = function(){
    var obj = jf.readFileSync("config.json");
    return obj;
}
exports.readServerInfo = function(name){
    var path = path2.join(__dirname, '/servers/' + name + "/serverInfo.json");
    var obj = jf.readFileSync(path);
    return obj;
}