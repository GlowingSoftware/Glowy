var mysql = require('mysql');
var mysqlSettings = {
    host: 'sql8.freemysqlhosting.net',
    user: 'sql8164855',
    password: 'vIaX9H4bp8',
    database: 'sql8164855'
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