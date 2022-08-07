const inquirer = require('inquirer');
const fs = require('fs');
const db = require('./config/config');
const db_table = require('console.table');
const { Console } = require('console');

//view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const options = ["VIEW all departments", "VIEW all roles", "VIEW all employees", "ADD a department", "ADD a role", "ADD an employee", "UPDATE an employee role", "Exit"]

function init() {
   inquirer.prompt([
        {
            type: 'list',
            message: "What would you like to do?: ",
            choices: options,
            loop: false,
            name: "choice"
        }
    ])
    .then(result => {
        // console.log(result);
        if (result.choice === "Exit") {
            db.end(); //exits the sql connection
            return;
        }

        switch(result.choice) {
            case "VIEW all departments":
              viewDept();
              break;
            case "VIEW all roles":
              viewRoles();
              break;
            case "VIEW all employees":
              viewEmployees();
              break;
            case "ADD a department":
              addDept();
              break;

          }
    })
    .catch(err => console.log(err))
}

function viewDept() {
    db.query("SELECT * FROM departments;", function (err, results) {
        console.table(results);
        init();
    })
}
function viewRoles() {
    const sqlViewRoles = `SELECT roles.id, roles.title, roles.salary, departments.name AS Department FROM roles JOIN departments ON roles.department_id = departments.id;`
    db.query(sqlViewRoles, function (err, results) {
        console.table(results);
        init();
    })
}
function viewEmployees() {
    const sqlViewEmp = `SELECT emp1.id, emp1.first_name AS First, emp1.last_name AS Last, roles.title AS Title, departments.name AS Department, roles.salary AS Salary, emp2.first_name AS Manager FROM employees AS emp1 LEFT JOIN employees AS emp2 ON emp1.manager_id = emp2.id LEFT JOIN roles ON emp1.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id`
    db.query(sqlViewEmp, function (err, results) {
        console.table(results);
        init();
    })
}

function addDept() {
    //TODO: add a department to database get 
    inquirer.prompt([
        {
            type: 'input',
            message: "Please Enter Name of Department: ",
            name: "deptName"
        }
    ])
    .then(results =>{
        let correctStr = results.deptName.charAt(0).toUpperCase() + results.deptName.slice(1);
        const sqlAdd = `INSERT INTO departments (name) VALUES ("${correctStr}");`
        const sqlFind = `SELECT 1 FROM departments WHERE name = "${correctStr}";`
        db.query(sqlFind, function (err, results) {
            if (results.length === 1) {
                console.log("Already in the database, Please choose a different title.")
            } else {
                db.query(sqlAdd, function (err, results) {
                    if (err) {
                        console.log(err, "Error on adding to database")
                    }
                })
            }
        })
        console.log(`Added ${correctStr} Department to database!`);
        init();
    })
    .catch(err => console.log(err));
}

init(); 