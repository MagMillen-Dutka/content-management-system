const inquirer = require("inquirer");
const {
  queryDepartment,
  queryRoles,
  queryEmployees,
  newDepartment,
  newRole,
  newEmployee,
  updateEmployee,
} = require("./assets/database/queries");


// connect to the employee_tracker_db
const mysql = require("mysql2");


// mainMenu prompt for asking the user what they'd like to do
const questions = {
  type: "list",
  message: "What would you like to do?",
  name: "mainMenu",
  choices: [
    "View All Departments",
    "View All Roles", 
    "View All Employees", 
    "Add a Department", 
    "Add a Role",
    "Add an Employee",
    "Update an Employee Role",
    "Exit App",
  ],
};


// Function to activate the functions for each activity
function runPrompt() {
  inquirer.prompt(questions).then((response) => {
    const selectedOption = response.mainMenu;

    switch (selectedOption) {
      case "View All Departments":
        viewDepartments();
        break;
      case "View All Roles":
        viewRoles();
        break;
      case "View All Employees":
        viewEmployees();
        break;
      case "Add a Department":
        addDepartment();
        break;
      case "Add a Role":
        addRole();
        break;
      case "Add an Employee":
        addEmployee();
        break;
      case "Update an Employee Role":
        updateEmployeeRole();
        break;
      case "Exit App":
        contAction();
        break;
    }
  });
}

function viewDepartments() {
  queryDepartment().then(function (res) {
    console.log("");
    console.table(res[0]);
    contAction();
  });
}

function viewRoles() {
  queryRoles().then(function (res) {
    console.log("");
    console.table(res[0]);
    runPrompt();
  });
}

function viewEmployees() {
  queryEmployees().then(function (res) {
    console.log("");
    console.table(res[0]);
    runPrompt();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "departmentName",
      message: "What is the name of the department?",
    })
    .then(function (res) {
      const departmentName = res.departmentName;
      newDepartment(departmentName)
        .then(function () {
          console.log(`Added ${departmentName} to the database\n`);
          runPrompt();
        })
        .catch(function (err) {
          console.log(
            `Error adding ${departmentName} to the database: ${err}\n`
          );
          runPrompt();
        });
    });
}

function addRole() {
  queryDepartment().then(function (res) {
    // Gets the list of departments from the database
    const departmentChoice = res[0].map(function (department) {
      return {
        name: department.title,
        value: department.id,
      };
    });
    // Prompt the user to input the role's name, input a salary and select the role's department
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "departmentId",
          message: "Which department does the role belong to?",
          choices: departmentChoice,
        },
      ])
      .then(function (res) {
        const title = res.title;
        const salary = res.salary;
        const departmentId = res.departmentId;
        newRole(title, salary, departmentId)
          .then(function () {
            console.log(`Added ${title} to the database\n`);
            runPrompt();
          })
          .catch(function (err) {
            console.log(`Error adding ${title} to the database: ${err}\n`);
            runPrompt();
          });
      });
  });
}

function addEmployee() {
  // Get the list of employees and roles from the database
  Promise.all([queryRoles(), queryEmployees()]).then(function (res) {
    // Create a list of roles to choose from
    const roleChoice = res[0][0].map(function (roles) {
      return {
        name: roles.title,
        value: roles.id,
      };
    });
  
    // Create a list of employees to choose from
    const managerChoice = res[1][0].map(function (employees) {
      return {
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      };
    });
    managerChoice.unshift({ name: "None", value: null });
   
    // Prompt the user to input the employees name, select a role and select the employees manager
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
          message: "What is the employee's role?",
          choices: roleChoice,
        },
        {
          type: "list",
          name: "managerId",
          message: "Who is the employee's manager?",
          choices: managerChoice,
        },
      ])
      .then(function (res) {
        const firstName = res.firstName;
        const lastName = res.lastName;
        const roleId = res.roleId;
        const managerId = res.managerId;
        // Adds the employee to the list of employees
        newEmployee(firstName, lastName, roleId, managerId)
          .then(function () {
            console.log(`Added ${firstName} ${lastName} to the database\n`);
            runPrompt();
          })
          .catch(function (err) {
            console.log(
              `Error adding ${firstName} ${lastName} to the database: ${err}\n`
            );
            runPrompt();
          });
      });
  });
}

function updateEmployeeRole() {
  // Get the list of employees and roles from the database
  Promise.all([queryEmployees(), queryRoles()]).then(function (res) {
    // Create a list of employees to choose from
    const employeeChoice = res[0][0].map(function (employee) {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });

    // Create a list of roles to choose from
    const roleChoice = res[1][0].map(function (role) {
      return {
        name: role.title,
        value: role.id,
      };
    });

    // Prompt the user to select an employee and a new role
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to update?",
          choices: employeeChoice,
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's new role?",
          choices: roleChoice,
        },
      ])
      .then(function (res) {
        const roleId = res.roleId;
        const employeeId = res.employeeId;
        // Update the employee's role in the database
        updateEmployee(employeeId, roleId)
          .then(function () {
            console.log(`Updated employee role in the database\n`);
            runPrompt();
          })
          .catch(function (err) {
            console.log(`Error updating employee role: ${err}\n`
            );
            runPrompt();
          });
      });
  });
}
function contAction () {

  inquirer
    .prompt([
      {
        type: "confirm",
        name: "continue",
        message: "Take more action in the database?"
      }
    ])

    .then(function(answer) {

      //if user opts to take another action on the database, run startup prompts again. If not, end the connection
      if (answer.continue === true) {
        runPrompt();
        
      } else {

        //end connection and notify user
        process.exit();

      }

  });

}
runPrompt();