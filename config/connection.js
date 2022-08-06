const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Strongpass'
    },
);


const sql = 'CREATE DATABASE IF NOT EXISTS company_db';
db.query(sql, function (err, results) {
    if (err) {
        console.log(err);
    }
});



module.exports = db