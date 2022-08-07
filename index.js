const inquirer = require('inquirer');
const fs = require('fs');
const db = require('./config/config');
const db_table = require('console.table');

const red = '\x1b[31m%s\x1b[0m';
const green = '\x1b[32m%s\x1b[0m';

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
            console.log("GoodBye!")
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
            case "ADD a role":
              addRoles();
              break;
            case "ADD an employee":
              addEmployee();
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
    inquirer.prompt([
        {
            type: 'input',
            message: "Please Enter Name of Department: ",
            name: "deptName"
        }
    ])
    .then(results => {
        let correctStr = results.deptName.charAt(0).toUpperCase() + results.deptName.slice(1);
        const sqlAdd = `INSERT INTO departments (name) VALUES ("${correctStr}");`
        const sqlFind = `SELECT 1 FROM departments WHERE name = "${correctStr}";`
        db.query(sqlFind, function (err, results) {
            if (results.length === 1) {
                console.log(red, "Already in the database, Please choose a different option.")
                init();
            } else {
                db.query(sqlAdd, function (err, results) {
                    if (err) {
                        console.log(err, "Error on adding to database")
                        return;
                    } else {
                        console.log(green, `Added ${correctStr} Department to database!`);
                        init();
                    }
                })
            }
        })
    })
    .catch(err => console.log(err));
}

async function addRoles() {
    const sqlGet = `SELECT departments.name FROM departments;`
    let newArray = await db.promise().query(sqlGet); //returns an array with two objects, access the first index for department names
    let deptArray = newArray[0].map(item => item.name);
    
    inquirer.prompt([
        {
            type: 'input',
            message: "Please Enter Title of Role: ",
            name: "roleName"
        },
        {
            type: 'input',
            message: "Please enter the Salary: ",
            name: "salary"
        },
        {
            type: 'list',
            message: "Which department does the role belong to?: ",
            choices: deptArray,
            loop: false,
            name: 'deptChoice'
        }
    ])
    .then(results =>{
        let str = results.roleName.split(" ");
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        str = str.join(" ");
        const sqlAdd = `INSERT INTO roles (title, salary, department_id) VALUES ("${str}", ${results.salary}, "${deptArray.indexOf(`${results.deptChoice}`) + 1}" );`
        const sqlFind = `SELECT 1 FROM roles WHERE title = "${str}";`
        db.query(sqlFind, function (err, results) {
            if (results.length === 1) {
                console.log(red, "Already in the database, Please choose a different option.")
                init();
            } else {
                db.query(sqlAdd, function (err, results) {
                    if (err) {
                        console.log(err, "Error on adding to database")
                        return;
                    } else {
                        console.log(green, `Added ${results.roleName} role to database!`);
                        init();
                    }
                })
            }
        })
    })
    .catch(err => console.log(err));
}

async function addEmployee() {
    const sqlGet = `SELECT title FROM roles;`
    let tempArray = await db.promise().query(sqlGet);
    let roleArray = tempArray[0].map(item => item.title);

    const sqlGet2 = `SELECT first_name FROM employees`
    const tempArray2 = await db.promise().query(sqlGet2);
    const empArray = tempArray2[0].map(item => item.first_name);
    
    inquirer.prompt([
        {
            type: 'input',
            message: "Please enter employee's first name: ",
            name: "firstName"
        },
        {
            type: 'input',
            message: "Please enter last name: ",
            name: "lastName"
        },
        {
            type: 'list',
            message: "Who is the employee's Manager?: ",
            choices: empArray,
            loop: false,
            name: "manager"
        },
        {
            type: 'list',
            message: "What is the employee's role?: ",
            choices: roleArray,
            loop: false,
            name: 'role'
        }
    ])
    .then(results => {
        const managerNum = empArray.indexOf(`${results.manager}`) + 1;
        const roleNum = roleArray.indexOf(`${results.role}`) + 1;
        const sqlAdd = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${results.firstName}", "${results.lastName}", ${roleNum}, ${managerNum});`
        const sqlFind = `SELECT 1 FROM employees WHERE first_name = "${results.firstName}" AND last_name = "${results.lastName}";`;
        db.query(sqlFind, function (err, results) {
            if (results.length === 1) {
                console.log(red, "Already in the database, Please choose a different option.")
                init();
            } else {
                db.query(sqlAdd, function (err, results) {
                    if (err) {
                        console.log(err, "Error on adding to database")
                        return;
                    } else {
                        console.log(green, `Added ${results.firstName} ${results.lastName} to the database!`);
                        init();
                    }
                })
            }
        })
    })
}

init(); 