const inquirer = require('inquirer');
const fs = require('fs');
const db = require('./config/config');
const db_table = require('console.table');

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
          }
    })
    .catch(err => console.log(err))
}

function viewDept() {
    //TODO: query database on dept table
    db.query("SELECT * FROM departments;", function (err, results) {
        console.table(results);
        init();
    })
}
//job title, role id, the department that role belongs to, and the salary for that role
function viewRoles() {
    //TODO: query database on roles table
    const sqlViewRoles = `SELECT roles.id, roles.title, roles.salary, departments.name AS Department FROM roles JOIN departments ON roles.department_id = departments.id;`
    db.query(sqlViewRoles, function (err, results) {
        console.table(results);
        init();
    })
}
//including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewEmployees() {
    //TODO: query database on employee table
    const sqlViewEmp = `SELECT emp1.id, emp1.first_name AS First, emp1.last_name AS Last, roles.title AS Title, departments.name AS Department, roles.salary AS Salary, emp2.first_name AS Manager FROM employees AS emp1 LEFT JOIN employees AS emp2 ON emp1.manager_id = emp2.id LEFT JOIN roles ON emp1.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id`
    db.query(sqlViewEmp, function (err, results) {
        console.table(results);
        init();
    })
}

init(); 