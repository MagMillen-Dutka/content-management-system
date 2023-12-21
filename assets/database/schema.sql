-- Drops the database if it exists --
DROP DATABASE IF EXISTS workforce_db;

-- Create the database  
CREATE DATABASE workforce_db;

-- Specify database to use
USE workforce_db;

-- Create the table department
CREATE TABLE department (
id INT PRIMARY KEY NOT NULL,
name VARCHAR(30) auto_increment NOT NULL,
PRIMARY KEY(id)
);

-- Create the table role
CREATE TABLE role (
id INT PRIMARY KEY NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL NOT NULL,
department INT,
FOREIGN KEY (department)
REFERENCES department (id)
);

-- Create the table employees that will hold the name, role, and manager 
-- Manager is the only value that is not required
CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id INT,
  manager_id integer,
  FOREIGN KEY (role_id) 
  REFERENCES role(id) on delete set null
  
);