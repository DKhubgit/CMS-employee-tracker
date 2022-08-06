const inquirer = require('inquirer');
const fs = require('fs');
const db = require('./config/connection');
const db_table = require('console.table');

//view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const options = ["1) VIEW all departments", "2) VIEW all roles", "3) VIEW all employees", "4) ADD a department", "5) ADD a role", "6) ADD an employee", "7) UPDATE an employee role", "8) Exit"]

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
        if (result.choice === "8) Exit") {
            db.end();
        }
    })
    .catch(err => console.log(err))
}

function viewDept() {
    //TODO: query database on dept table
}

function viewRoles() {
    //TODO: query database on roles table
}

function viewEmployees() {
    //TODO: query database on employee table
}

init(); 