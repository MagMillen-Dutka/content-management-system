// Important require inquirer 
const inquirer = require("inquirer");
// Import and require mysql
const mysql = require('mysql');
// Import and require console table
const consoleTable = require('console.table');


// Connect to database
const databaseConnection = mysql.createConnection(
  {
    host: 'localhost',
    port: 3306,
    // MySQL username
    user: 'root',
    // MySQL password here
    password: 'password',
    database: 'workforce_db',
  },
  console.log(`Connected to the workforce_db database.
  `)
);

// connect to server and db, and once connected, run first function
databaseConnection.connect(function(err) {

  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log('\n' + "Connected as id " + databaseConnection.threadId + ". Welcome to the Workforce CMS app!"  );

  //run function that will ask the user what they want to do in the database
  action();

});

//First option upon initial 'node index.js' command
function action() {

  inquirer
    .prompt({

      type: "list",
      name: "action",
      message: "What would you like to do first?",
      choices: 
      ["View all employees",
      "View all departments",
      "View all roles",
      "Add an employee",
      "Add a department",
      "Add a role",
      "Update employee role",
      "Exit app"
      ]

    })

      .then(function(answer) {

      // Run the correct function depending on chosen option
      switch (answer.action) {

        case "View all employees":
        viewEmplAll();
        break;

        case "View all departments":
        viewDept();
        break;

        case "View all roles":
        viewRoles();
        break;

        case "Add an employee": 
        addEmpl();
        break;

        case "Add a department":
        addDept();
        break;

        case "Add a role":
        addRole();
        break; 

        case "Update employee role":
        updateEmplRole();
        break;

        case "Exit app":
        contAction();
        break

      }

    });
}



function viewEmplAll () {

  //select statement
  var query = "select employee.id, employee.first_name, employee.last_name, role.title, department.dept as 'department', role.salary, ifnull(concat(m.first_name, ' ', m.last_name), 'none') as 'manager' " ;
  
  //add from statement that inclues join
  query += "from employee inner join role on (employee.role_id = role.id) ";

  //add join department by department id and foreign key in role table
  query += "inner join department on role.department = department.id "; 

  //add left join only so that employee information will display as manager even if the manager id is null
  query += "left join employee as m on employee.manager_id = m.id "
  
  query += "order by first_name asc";

    databaseConnection.query(query, function(err, res){
      if (err) throw err;

        //set variable to hold response from query
        let alldata = [];

        //loop through response and push all to alldata var
        for (var i = 0; i < res.length; i++) {
          alldata.push(res[i])
        }

        //display all data as table
        console.table('\n', alldata);

      //ask if user would like to take another action in db
      contAction();

    });

}


function addEmpl () {

  //create variables that hold queries for the employee and role tables
  let queryEmpl = "SELECT employee.id, employee.first_name, employee.last_name, concat(employee.first_name, ' ', employee.last_name) 'fullname', employee.role_id from employee order by employee.first_name asc";

  let queryAppt = "SELECT * from role order by role.title asc"

  //create variables that will hold the responses of those queries
  let queryEmplRes = [];
  let queryApptRes = [];

  //create a promise that will return query data from both tables then apply to inquirer prompts, some of which display data from the database for user selections
  new Promise ((resolve, reject) => {
    databaseConnection.query(queryEmpl, function(err, res){
      if (err) { reject(err);
      } else { resolve(res);
        queryEmplRes = res;
      }
    });
    
  }).then( (data) => {
    databaseConnection.query(queryAppt, function(err, res){
      if (err) { throw err };
      queryApptRes = res;
    });
  }).then (() => {
    
      //prompt user for data that will ultimately be inserted into the database
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstname",
            message: "Enter employee's first name:",
            validate: (text) => {
              if (text === "") {
                return "Please enter a name";
              }
                return true;
            }
          },
          {
            type: "input",
            name: "lastname",
            message: "Enter employee's last name:",
            validate: (text) => {
              if (text === "") {
                  return "Please enter a name";
              }
              return true;
            }
          },
          {
            type: "list",
            name: "apptEntry",
            message: "Enter employee's role:",
            choices: () => {
              let apptList = [];
              for (let i = 0; i < queryApptRes.length; i++) {
                apptList.push(queryApptRes[i].title);
              }

              return apptList;
            }
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: () => {
              let managerList = ['none'];
              for (let i = 0; i < queryEmplRes.length; i++) {
                managerList.push(queryEmplRes[i].fullname);
              }
              // console.log(employeesList)
              return managerList;
            }
          }
        ])
      
      .then(function(answer) {

        //match user input against database response and get manager id (which == employee id)
        //default to none for startup database
        let managerID = null;

        for (let i = 0; i < queryEmplRes.length; i++) {
          if (answer.manager === queryEmplRes[i].fullname && answer.manager !== '') {
              managerID = queryEmplRes[i].id;
          } 
        }

        //match user input against database response and get roleID
        let roleID = "";

        for (let i = 0; i < queryApptRes.length; i++) {
            if (answer.apptEntry === queryApptRes[i].title) {
                roleID = queryApptRes[i].id;
            }
        }


        //connect to sql database and insert the following values that represent a new employee
        //empl id will auto increment in database, no need to define here
        databaseConnection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.firstname,
            last_name: answer.lastname,
            role_id: roleID,
            manager_id: managerID
          },

            function(err, res) {
            if (err) throw err;

            console.log("New employee has been added!");
            // ask if user would like to take another action in db
            contAction();
            
            }
        );
    
      });
    
  }).catch(err => {

    console.log(err);

  });

}



function addRole () {

  let queryDept = "SELECT department.dept, department.id from department order by department.dept asc"
  
  databaseConnection.query(queryDept, function(err, res){
    if (err) throw err;

      inquirer
        .prompt([
          {
            type: "input",
            name: "newtitle",
            message: "Enter new role title:",
            validate: (text) => {
              if (text === "") {
                return "Please enter a role name";
              }
                return true;
            }
          },
          {
            type: "input",
            name: "newsalary",
            message: "Enter salary for this role (ex/30000):",
            validate: (num) => {
              if (num === "") {
                  return "Please enter number";
              }
              return true;
            }
          },
          {
            type: "list",
            name: "deptlist",
            message: "Select department in which role resides",
            choices: () => {
                let deptList = [];
                for (let i = 0; i < res.length; i++) {
                  deptList.push(res[i].dept);
                }
                return deptList;
            }
          }

        ])

      .then(function(answer) {

        let deptID = "";

        for (let i = 0; i < res.length; i++) {
          if (answer.deptlist === res[i].dept) {
            deptID = res[i].id;
          }
        }

      //connect to sql database and insert the following name for the department
        //dept id will auto increment in database, no need to define here
        databaseConnection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.newtitle,
            salary: answer.newsalary,
            department_id: deptID,
          },

            function(err, res) {
            if (err) throw err;

            console.log("New role added!");
            // ask if user would like to take another action in db
            contAction();
            
            }
        );
        
      });

    //end connection query
  });

}



function addDept () {

  //prompt user for data that will ultimately be inserted into the database
  inquirer
    .prompt([
      {
        type: "input",
        name: "newdept",
        message: "Enter the new department name:",
        validate: (text) => {
          if (text === "") {
            return "Please enter a department name";
          }
            return true;
        }
      }
    ])

  .then(function(answer) {

    //connect to sql database and insert the following name for the department
    //dept id will auto increment in database, no need to define here
    databaseConnection.query(
      "INSERT INTO department SET ?",
      {
        dept: answer.newdept,
      },

        function(err, res) {
        if (err) throw err;

        console.log("New department added!");
        // ask if user would like to take another action in db
        contAction();
        
        }
    );

  });
}


function updateEmplRole () {

  //create variables that hold queries for the employee and role tables
  let queryEmpl = "SELECT employee.id, employee.first_name, employee.last_name, concat(employee.first_name, ' ', employee.last_name) 'fullname', employee.role_id from employee order by employee.first_name asc";

  let queryAppt = "SELECT * from role order by role.title asc"

  //create variables that will hold the responses of those queries
  let queryEmplRes = [];
  let queryApptRes = [];

  //create a promise that will return query data from both tables then apply to inquirer prompts, some of which display data from the database for user selections
  new Promise ((resolve, reject) => {
    databaseConnection.query(queryEmpl, function(err, res){
      if (err) { reject(err);
      } else { resolve(res);

        queryEmplRes = res;

      }
    });
    
  }).then(data => {
    databaseConnection.query(queryAppt, function(err, res){
      if (err) { throw err };

      queryApptRes = res;

    });

  }).then (data => {

      inquirer
        .prompt([
          {
            name: "emplupdate",
            type: "list",
            message: "Select employee to update",
            choices: () => {
              let employeesList = [];
              for (let i = 0; i < queryEmplRes.length; i++) {
                employeesList.push(queryEmplRes[i].fullname);
              }
              return employeesList;
            }
          },
          {
            name: "apptupdate",
            type: "list",
            message: "Enter new role:",
            choices: () => {
              let apptList = [];
              for (let i = 0; i < queryApptRes.length; i++) {
                apptList.push(queryApptRes[i].title);
              }
              return apptList;
            }
          }
        ])

      .then(function(answer) {

        let emplID = "";

        for (let i = 0; i < queryEmplRes.length; i++) {
          if (answer.emplupdate === queryEmplRes[i].fullname) {
              emplID = queryEmplRes[i].id;
          }
        }
     
        //match user input against database response and get roleID
        let roleID = "";

        for (let i = 0; i < queryApptRes.length; i++) {
          if (answer.apptupdate === queryApptRes[i].title) {
              roleID = queryApptRes[i].id;
          }
        }

        databaseConnection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              role_id: roleID
            },
            {
              id: emplID
            }
          ],
  
            function(err, res) {
            if (err) throw err;
  
            console.log("update complete!");
            // ask if user would like to take another action in db
            contAction();
            
            }
        );

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

        action();
        
      } else {

        //end connection and notify user
        databaseConnection.end();
        console.log(`Connection to database closed. Thank you for using the app!`)

      }

  });

}








