const mysql = require('mysql');

const mysql_co = mysql.createConnection({
    host: "localhost",
    user: "root",
});

mysql_co.connect(function(err) {
    if (err) throw err;
    mysql_co.query("DROP DATABASE IF EXISTS test");
    mysql_co.query("CREATE DATABASE test", function (err, result) {
        if (err) throw err;
        console.log("Base de données \"test\" créée.");
        mysql_co.query("USE test");
        mysql_co.query("CREATE TABLE users(id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, email VARCHAR(100) UNIQUE, password VARCHAR(300), access_token VARCHAR(1000)) ENGINE=INNODB;", (err, rows, field) => {
            if (err) throw err;
            console.log('Tables "users" créées.');
            mysql_co.end();
        });
    });
});


