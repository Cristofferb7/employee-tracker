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
      } else if (answer.input == "view all employees") {
      viewAllEmployees();
    }  else if (answer.input == "add employee") {
      addEmployees();
    } else if (answer.input == "udpate employee role") {
      updateEmployee();}

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
  const roleQuery = "SELECT r.id, r.title, r.salary, d.name AS department_name FROM role r INNER JOIN department d ON r.department_id = d.id;";
  db.query(roleQuery, function (err, roles) {
    if (err) {
      console.log(err);
      return;
    }
    console.table(roles);
    mainMenu();
  });
}


// to do here(add role function)>>

function addRole() {
  // Fetch existing department names from the database
  db.query("SELECT id, name FROM department;", function (fetchErr, departments) {
    if (fetchErr) {
      console.log(fetchErr);
      return;
    }

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
          type: 'list',
          name: 'department',
          message: 'Select the department for this role:',
          choices: departments.map(department => ({ name: department.name, value: department.id })),
        }
      ])
      .then((answer) => {
        const title = answer.name;
        const salary = parseFloat(answer.salary); // Assuming salary is a numeric value
        const departmentId = answer.department;

        // Insert the role with the department ID
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

// to do here (add view all employees)
function viewAllEmployees() {
  const query = `
    SELECT 
      e.id,
      e.first_name,
      e.last_name,
      r.title AS job_title,
      d.name AS department,
      r.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM
      employee e
    LEFT JOIN
      role r ON e.role_id = r.id
    LEFT JOIN
      department d ON r.department_id = d.id
    LEFT JOIN
      employee m ON e.manager_id = m.id;
  `;

  db.query(query, function (err, employees) {
    if (err) {
      console.log(err);
      return;
    }
    console.table(employees);
    mainMenu();
  });
}

// to do here (add add employees function)
function addEmployees() {
  // Fetch existing roles from the database
  db.query("SELECT id, title FROM role;", function (roleFetchErr, roles) {
    if (roleFetchErr) {
      console.log(roleFetchErr);
      return;
    }

    // Fetch existing employees from the database
    db.query("SELECT id, first_name, last_name FROM employee;", function (empFetchErr, employees) {
      if (empFetchErr) {
        console.log(empFetchErr);
        return;
      }

      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "roleId",
            message: "Select the employee's role:",
            choices: roles.map(role => ({ name: role.title, value: role.id })),
          },
          {
            type: "list",
            name: "managerId",
            message: "Select the employee's manager:",
            choices: [
              { name: "None", value: null },
              ...employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
            ],
          },
        ])
        .then((answers) => {
          const firstName = answers.firstName;
          const lastName = answers.lastName;
          const roleId = answers.role;
          const managerId = answers.managerId;

          // Insert the new employee into the database
          const employeeQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
          db.query(employeeQuery, [firstName, lastName, roleId, managerId], function (err, data) {
            if (err) {
              console.log(err);
            } else {
              console.log("Added a new employee!");
              mainMenu();
            }
          });
        });
    });
  });
}

function updateEmployee() {
  // Fetch existing employees and roles from the database
  db.query("SELECT id, first_name, last_name FROM employee;", function (empFetchErr, employee) {
    if (empFetchErr) {
      console.log(empFetchErr);
      return;
    }

    console.log("Fetched employees:", employee);

    db.query("SELECT id, title FROM role;", function (roleFetchErr, roles) {
      if (roleFetchErr) {
        console.log(roleFetchErr);
        return;
      }

      console.log("Fetched roles:", roles);

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Select the employee to update:",
            choices: employee.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
          },
          {
            type: "list",
            name: "role",
            message: "Select the new role for the employee:",
            choices: roles.map(role => ({ name: role.title, value: role.id })),
          },
        ])
        .then((answers) => {
          const employeeId = answers.employee;
          const roleId = answers.role;

          // Update the employee's role in the database
          const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
          db.query(updateQuery, [roleId, employeeId], function (err, data) {
            if (err) {
              console.log(err);
            } else {
              console.log("Employee role updated successfully!");
              mainMenu();
            }
          });
        });
    });
  });
}



mainMenu();