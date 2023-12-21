# content-management-system

## Description:
The application is designed to track the employees of a company by allowing the user to manipulate the different roles, departments and basic employee information such as salary and name. This allows HR teams to quickly add new employees as well as change existing employee data to match their current situation - For example, a change of department.

The below criteria is the basis for the technical specification.


## Table of Contents:
* [License](#license)
* [User Story](#user-story)
* [Acceptance Criteria](#acceptance-criteria)
* [Installation Process](#installation-process)
* [Sources](#sources)
* [Repository and Images](#repository)

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Installation Process
1. Clone the code from the repository (see details below for link)
2. Install the following: 
* Node.JS [Version 16.18.1](https://nodejs.org/en/blog/release/v16.18.1/)
* MYSQL2 [Version 3.6.5](https://www.npmjs.com/package/mysql2)
* Console Table [Version 0.10.0](https://www.npmjs.com/package/console.table)
* Inquirer.js: [Version 8.2.4](https://www.npmjs.com/package/inquirer/v/8.2.4)
3. Open the cloned repository in any source code editor.
4. Open the integrated terminal for the document and complete the respective installation guides provided above in section (2.) to ensure the cloned documentation will operate.
5. Run the program by using 'node index.js' command in your terminal.

## Sources

Code snippets taken from Zach Mutch and tailored to specific needs of this application. Amendments made to runPrompt functions as well as adding exit/contAction function to end the process if no further actions required.

Zach Mutch's [Github](https://github.com/that-devguy).

## Repository:
[Solution URL Link](https://github.com/MagMillen-Dutka/content-management-system)

## Walkthrough Video:
[Click Here to Watch](https://drive.google.com/file/d/1FRQUVxI5_WC9PBQqMcPj8vSsNCBjUKjy/view)

## Screenshots:
### Figure 1. Command line application initial command
![](./assets/images/Opening%20command.jpg) 
### Figure 2. View & Add Department - Added CEO Office
![](./assets/images/Add%20Department.jpg)
### Figure 3. View & Add Employee - Added Peter Parker
![](./assets/images/Add%20Employee.jpg)
