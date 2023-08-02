const inquirer = require("inquirer");
const mysql2 = require("mysql2");
require("console.table");

const db = mysql2.createConnection({
  host: "localhost",
  port: 3306,
  database: "homework_db",
  user: "root",
  password: "root",
});

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "input",
        message: "what would you like to do",
        choices: [
          "view all employees",
          "add employee",
          "update employee role",
          "view all roles",
          "add role",
          "view all departments",
          "add department",
        ],
      },
    ])
    .then((answer) => {
      if (answer.input == "view all departments") {
        viewAllDepartments();
      } else if (answer.input == "add department") {
        addDepartment();
      } else if (answer.input == "view all roles") {
        viewAllRoles();
      } else if (answer.input == "add role") {
        addRole();
      }
    });
}

function viewAllDepartments() {
  // get all department data from department table
  // select * from department;

  db.query("select * from department;", function (err, data) {
    if (err) console.log(err);
    // display all data using console.table
    console.table(data);
    mainMenu();
  });
}

function addDepartment() {
  // ask what is the name of the new department
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the new department?",
      },
    ])
    .then((answer) => {
      // insert into department(name) values ("Human Resources");
      db.query(
        'insert into department(name) values ("' + answer.name + '");',
        function (err, data) {
          if (err) console.log(err);
          // display all data using console.table
          console.log("Added a new department!");
          mainMenu();
          
        }
      );
    });
}

// to do here(use all departments function example) >>>
function viewAllRoles () {

}
// to do here(add deparment function)>>
function addRole () {

}



mainMenu();