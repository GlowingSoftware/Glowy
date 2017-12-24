var jf = require('jsonfile');
var path2 = require('path');
var fs = require('fs');

exports.readConfig = function(){
    var obj = jf.readFileSync("config/config.json");
    return obj;
}
exports.readServerInfo = function(name){
    var path = path2.join(__dirname, '/servers/' + name + '/serverInfo.json');
    if (fs.existsSync(path)){
        var obj = jf.readFileSync(path);
        return obj;
    } else {
        return null;
    }
}
exports.rootPath = function(){
    var root = __dirname;
    //console.log(root)
    return root;
}