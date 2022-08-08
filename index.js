const inquirer = require('inquirer');
const fs = require('fs');
const db = require('./config/config');
const db_table = require('console.table');

const red = '\x1b[31m%s\x1b[0m';
const green = '\x1b[32m%s\x1b[0m';

//view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const options = ["VIEW all departments", "VIEW all roles", "VIEW all employees", "ADD a department", "ADD a role", "ADD an employee", "UPDATE an employee role", "DELETE a Department","DELETE a Role","DELETE an Employee", "Exit"]

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
            case "UPDATE an employee role":
              updateRole();
              break;
            case "DELETE a Department":
              deleteDept();
              break;
            case "DELETE a Role":
              deleteRole();
              break;
            case "DELETE an Employee":
              deleteEmp();
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
    //When joining the same table, must have aliases for each table. 
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
        //capitalizes the first letter of the word
        let correctStr = results.deptName.charAt(0).toUpperCase() + results.deptName.slice(1);

        const sqlAdd = `INSERT INTO departments (name) VALUES (?);`
        const sqlFind = `SELECT 1 FROM departments WHERE name = ?;`
        db.execute(sqlFind, [correctStr], function (err, results) {
            if (results.length === 1) {
                console.log(red, "Already in the database, Please choose a different option.")
                init();
            } else {
                db.execute(sqlAdd, [correctStr], function (err, results) {
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
    //grabs the data from the database and appends them into an array.
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
        //capitalizes the first letter of each word that was inputed
        let str = results.roleName.split(" ");
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        str = str.join(" ");
        const sqlAdd = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, "${deptArray.indexOf(`${results.deptChoice}`) + 1}" );`
        const sqlFind = `SELECT 1 FROM roles WHERE title = ?;`
        db.execute(sqlFind,[str], function (err, result) {
            if (result.length === 1) {
                console.log(red, "Already in the database, Please choose a different option.")
                init();
            } else {
                db.query(sqlAdd,[str, results.salary], function (err, res) {
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
        //gets the index of the array and tweaks it to match the data table ids.
        const managerNum = empArray.indexOf(`${results.manager}`) + 1;
        const roleNum = roleArray.indexOf(`${results.role}`) + 1;

        const sqlAdd = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ${roleNum}, ${managerNum});`
        const sqlFind = `SELECT 1 FROM employees WHERE first_name = ? AND last_name = ?;`;
        db.execute(sqlFind,[results.firstName, results.lastName], function (err, result) {
            if (result.length === 1) {
                console.log(red, "Already in the database, Please choose a different option.")
                init();
            } else {
                db.execute(sqlAdd,[results.firstName, results.lastName], function (err, res) {
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
    .catch(err => console.log(err));
}

async function updateRole() {
    const sqlGet2 = `SELECT first_name FROM employees`
    const tempArray2 = await db.promise().query(sqlGet2);
    const empArray = tempArray2[0].map(item => item.first_name);

    const sqlGet = `SELECT title FROM roles;`
    let tempArray = await db.promise().query(sqlGet);
    let roleArray = tempArray[0].map(item => item.title);

    inquirer.prompt([
        {
            type: 'list',
            message: "Select the Employee to update their role: ",
            choices: empArray,
            name: 'theEmp'
        },
        {
            type: 'list',
            message: "Select the new role for the Employee: ",
            choices: roleArray,
            name: 'theRole'
        }
    ])
    .then(results => {
        const empNum = empArray.indexOf(`${results.theEmp}`) + 1;
        const roleNum = roleArray.indexOf(`${results.theRole}`) + 1;
        const sqlUpdate = `UPDATE employees SET role_id = ${roleNum} WHERE id = ${empNum}`
        db.query(sqlUpdate, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(green, `Updated ${results.theEmp}'s role!`);
                init();
            }
        })
    })
    .catch(err => console.log(err));
}

async function deleteDept() {
    const sqlGet = `SELECT name FROM departments`
    const tempArray = await db.promise().query(sqlGet);
    const deptArray = tempArray[0].map(item => item.name);
    inquirer.prompt([
        {
            type: 'list',
            message: "Which Department would you like to delete?: ",
            choices: deptArray,
            loop: false,
            name: "deleteDept"
        }
    ])
    .then(results => {
        const sql = `DELETE FROM departments WHERE id = ${deptArray.indexOf(`${results.deleteDept}`) + 1}`
        db.query(sql, function (err,result) {
            if (err) {
                console.log(err)
            } else {
                console.log(green, `Deleted Department!`);
                init();
            }
        });
    })
    .catch(err => console.log(err));
}

async function deleteRole() {
    const sqlGet = `SELECT title FROM roles`
    const tempArray = await db.promise().query(sqlGet);
    const roleArray = tempArray[0].map(item => item.title);
    inquirer.prompt([
        {
            type: 'list',
            message: "Which Role would you like to delete?: ",
            choices: roleArray,
            loop: false,
            name: "deleteRole"
        }
    ])
    .then(results => {
        const sql = `DELETE FROM roles WHERE id = ${roleArray.indexOf(`${results.deleteRole}`) + 1}`
        db.query(sql, function (err,result) {
            if (err) {
                console.log(err)
            } else {
                console.log(green, `Deleted Role!`);
                init();
            }
        });
    })
    .catch(err => console.log(err));
}

async function deleteEmp() {
    const sqlGet = `SELECT first_name FROM employees`
    const tempArray = await db.promise().query(sqlGet);
    const empArray = tempArray[0].map(item => item.first_name);
    inquirer.prompt([
        {
            type: 'list',
            message: "Which Employee would you like to delete?: ",
            choices: empArray,
            loop: false,
            name: "deleteEmp"
        }
    ])
    .then(results => {
        const sql = `DELETE FROM employees WHERE id = ${empArray.indexOf(`${results.deleteEmp}`) + 1}`
        db.query(sql, function (err,result) {
            if (err) {
                console.log(err)
            } else {
                console.log(green, `Deleted Employee!`);
                init();
            }
        });
    })
    .catch(err => console.log(err));
}

init(); 