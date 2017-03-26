var configReader = require('./configReader')
var mysql = require('mysql');
var config = configReader.readConfig();
var mysqlSettings = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

exports.register = function (username, email, password, callback) {
    var connection = mysql.createConnection(mysqlSettings);
    connection.connect();
    connection.query("SELECT * FROM `users` WHERE username='" + username + "'", function (err, rows, fields) {
        if (!err) {
            if (rows == 0) {
                connection.query("INSERT into `users` (username, password, email) VALUES ('" + username + "', '" + password + "', '" + email + "')", function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        callback(true);
                    } else {
                        console.log('Error while performing Query: ' + err);
                        connection.end();
                        callback(false);
                    }
                });
            } else {
                //There is already one user with that username
                connection.end();
                callback(false);
            }
        } else {
            console.log('Error while performing Query: ' + err);
            connection.end();
            callback(false);
        }
    });
}
exports.login = function (username, password, callback) {
    var connection = mysql.createConnection(mysqlSettings);
    connection.connect();
    connection.query("SELECT * FROM `users` WHERE username='" + username + "' and password='" + password + "'", function (err, rows, fields) {
        if (!err) {
            //If password is correct...
            if (rows.length > 0) {
                //All is correct
                connection.end();
                callback(true);
            } else {
                //Password is incorrect
                connection.end();
                callback(false);
            }
        } else {
            console.log('Error while performing Query: ' + err);
            connection.end();
            callback(false);
        }
    });
}