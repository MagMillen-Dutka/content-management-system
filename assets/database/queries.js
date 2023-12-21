// Imports console.table
const cTable = require("console.table");
const connection = require("./connection");

const queryDepartment = function () {
  const query = "SELECT * FROM department";
  return connection.promise().query(query);
};

const queryRoles = function () {
  const query =
    "SELECT roles.id, roles.title, roles.salary, department.title AS department FROM roles INNER JOIN department ON roles.department_id = department.id";
  return connection.promise().query(query);
};

const queryEmployees = function () {
  const query =
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, department.title AS department, roles.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id";
  return connection.promise().query(query);
};

const newDepartment = function (departmentName) {
  const query = "INSERT INTO department (title) VALUES (?)";
  return connection.promise().query(query, [departmentName]);
};

const newRole = function (roleName, salary, departmentId) {
  const query =
    "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
  return connection.promise().query(query, [roleName, salary, departmentId]);
};

const newEmployee = function (firstName, lastName, roleId, managerId) {
  const query =
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
  return connection
    .promise()
    .query(query, [firstName, lastName, roleId, managerId]);
};

const updateEmployee = function (employeeId, roleId) {
  const query = "UPDATE employees SET role_id = ? WHERE id = ?";
  return connection.promise().query(query, [roleId, employeeId]);
};

module.exports = {
  queryDepartment,
  queryRoles,
  queryEmployees,
  newDepartment,
  newRole,
  newEmployee,
  updateEmployee,
};