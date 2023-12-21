// connect to the employee_tracker_db
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_tracker_db",
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }
    //   console.log( '\n' + "Connected to the database.");
      
  });

module.exports = connection;