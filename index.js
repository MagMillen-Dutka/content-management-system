// Important require inquirer 
const inquirer = require("inquirer");
// Import and require mysql
const mysql = require('mysql');
// Import and require console table
const consoleTable = require('console.table');


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username
    user: 'root',
    // MySQL password here
    password: 'password',
    database: 'workforce_db'
  },
  console.log(`Connected to the workforce_db database.`)
);

// connect to server and db, and once connected, run first function
connection.connect(function(err) {

  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log('\n' + "Connected as id " + connection.threadId + ". Welcome to the Workforce CMS app!");

  //run function that will ask the user what they want to do in the database
  action();

});

//runs at startup to prompt user what they would like to do next
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















// Create a movie
app.post('/api/new-movie', ({ body }, res) => {
  const sql = `INSERT INTO movies (movie_name)
    VALUES (?)`;
  const params = [body.movie_name];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Read all movies
app.get('/api/movies', (req, res) => {
  const sql = `SELECT id, movie_name AS title FROM movies`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Delete a movie
app.delete('/api/movie/:id', (req, res) => {
  const sql = `DELETE FROM movies WHERE id = ?`;
  const params = [req.params.id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
      message: 'Movie not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Read list of all reviews and associated movie name using LEFT JOIN
app.get('/api/movie-reviews', (req, res) => {
  const sql = `SELECT movies.movie_name AS movie, reviews.review FROM reviews LEFT JOIN movies ON reviews.movie_id = movies.id ORDER BY movies.movie_name;`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// BONUS: Update review name
app.put('/api/review/:id', (req, res) => {
  const sql = `UPDATE reviews SET review = ? WHERE id = ?`;
  const params = [req.body.review, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Movie not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
