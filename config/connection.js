const mysql = require('mysql2');

let dbase = '';

//connecting to mysql
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        database: `${dbase}`,
        password: 'Strongpass'
    },
);

//create Database with tables
const sql = 'CREATE DATABASE IF NOT EXISTS company_db';
db.query(sql, function (err, results) {
    if (err) {
        console.log(err, 'database is not creating');
    }
});

db.query("USE company_db", function (err, result) {
    if (err) {
        console.log(err, "not wanting to use database");
    }
})

const deptTable = `CREATE TABLE IF NOT EXISTS departments (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL);`

db.query(deptTable, function (err, results) {
    if (err) {
        console.log(err, 'deptTable is not creating');
    }
});

const roleTable = `CREATE TABLE IF NOT EXISTS roles (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(30) NOT NULL, salary DECIMAL NOT NULL, department_id INT, FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL);`

db.query(roleTable, function (err, results) {
    if (err) {
        console.log(err, "roleTable is not creating");
    }
});

const empTable = `CREATE TABLE IF NOT EXISTS employees (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, role_id INT, FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL, manager_id INT REFERENCES employee(id) ON DELETE SET NULL);`

db.query(empTable, function (err, results) {
    if (err) {
        console.log(err, "empTable is not creating");
    }
});

module.exports = db