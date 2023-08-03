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
  db.query("select * from role;", function (err, data) {
  if (err) console.log(err);
  // display all data using console.table
  console.table(data);
  mainMenu();
});
}


// to do here(add deparment function)>>
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the new role?",
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary?',
      },
      {
        type: 'input',
        name: 'department',
        message: 'What is the name of the department for this role?',
      }
    ])
    .then((answer) => {
      const title = answer.name;
      const salary = parseFloat(answer.salary); // Assuming salary is a numeric value
      const departmentName = answer.department;

      // First, insert the department if it doesn't exist
      const departmentQuery = 'INSERT INTO department (name) VALUES (?)';
      db.query(departmentQuery, [departmentName], function (deptErr, deptData) {
        if (deptErr) {
          console.log(deptErr);
          return;
        }

        // Get the ID of the newly inserted department or existing department
        const departmentId = deptData.insertId || deptData[0].id;

        // Then, insert the role with the department ID
        const roleQuery = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        db.query(roleQuery, [title, salary, departmentId], function (roleErr, roleData) {
          if (roleErr) {
            console.log(roleErr);
          } else {
            console.log("Added a new role!");
            mainMenu();
          }
        });
      });
    });
}
mainMenu();