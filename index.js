const inquirer = require('inquirer');
const fs = require('fs');
const db = require('./config/connection');
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