-- Drops the database if it exists --
DROP DATABASE IF EXISTS workforce_db;

-- Create the database  
CREATE DATABASE workforce_db;

-- Specify database to use
USE workforce_db;

-- Create the table department
CREATE TABLE department (
id INT PRIMARY KEY,
name VARCHAR(30) NOT NULL,
PRIMARY KEY(id)
);

-- Create the table role
CREATE TABLE role (
id INT PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL,
department INT,
);

-- Create the table employees that will hold the name, role, and manager 
-- Manager is the only value that is not required
-- role_id and manager_id are foreign keys; when an appointment or manager is deleted, the values will be set to null
CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role INT,
  manager_id integer,
  FOREIGN KEY (role) REFERENCES role(id) on delete set null,
  FOREIGN KEY (manager_id) REFERENCES employee(id) on delete set null
);