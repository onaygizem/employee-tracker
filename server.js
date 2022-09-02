// Import classes
const database = require('./lib/database');
// const role = require('./lib/role');
// const employee = require('./lib/employee');


const cTable = require('console.table');


// node modules
// const express = require('express'); 
const fs = require('fs');
const inquirer = require("inquirer");

// const PORT = process.env.PORT || 3001;
// const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// departmentInst = new department();
// departmentInst.select("name", "id", "2");

// roleInst = new role();
// roleInst.select();
// connectionInst.addToTable("Test");



// Ask user if they want to add another employee
function initialQuestions() {
  inquirer.prompt([
    {
      type: "list",
      name: "initialQuestions",
      message: "What would you like to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
      ]
    }
  ])
    .then(
      function (initialQuestionAnswer) {
        switch (initialQuestionAnswer.initialQuestions) {
          case "view all departments":
            view("department");
            break;
          case "view all roles":
            view("role");
            break;
          case "view all employees":
            view("employee");
            break;
          case "add a department":
            addADepartment();
            break;
          case "add a role":
            addARole();
            break;
          case "add an employee":
            addAEmployee();
            break;
          case "update an employee role":
            updateEmployee();
            break;
          default:
            console.log("Default");
        }
      }
    )
}

async function view(tableName) {
  let tableInst = new database(tableName);
  let result;
  if(tableName === "employee"){
    result = await tableInst.join()
  } else {
    result = await tableInst.select()
  }
  console.log("*************************************************************************")
  console.log("*************************************************************************")
  console.log("                                                                         ")
  console.log("                                                                         ")
  console.table(result);
  console.log("                                                                         ")
  console.log("*************************************************************************")
  console.log("*************************************************************************")
  initialQuestions();
}

function addADepartment() {
  inquirer.prompt([
    {
      type: "input",
      name: "nameOfDepartment",
      message: "What is the name of the department?"
    }
  ])
    .then(
      async function (nameOfDepartmentAnswer) {
        let userInput = nameOfDepartmentAnswer.nameOfDepartment

        let tableInst = new database("department");
        await tableInst.addToTable(`"${userInput}"`)
        console.log(`Added ${userInput} to the Database.`);
        initialQuestions();
      })
}

async function addARole() {
  // Create a department name Array
  let departmentNameArray = [];

  // Get the values from department
  let departentInst = new database("department");
  let departmentNames = await departentInst.select("name")

  // Get all the department names from the database and push it into an array
  Object.entries(departmentNames).forEach(
    ([key, value]) => departmentNameArray.push(value.name)
  );

  inquirer.prompt([
    {
      type: "input",
      name: "nameOfTheRole",
      message: "What is the name of the role?"
    },
    {
      type: "input",
      name: "salaryOfTheRole",
      message: "What is the salary of the role?"
    },
    {
      type: "list",
      name: "departmentForTheRole",
      message: "Which department does the role belong to?",
      choices: departmentNameArray
    }
  ])
    .then(
      async function (roleAnswer) {

        // Get user input for each question
        let { nameOfTheRole: nameRole, salaryOfTheRole: salaryRole, departmentForTheRole: departmentRole } = roleAnswer;

        // Get the id for the department user chose
        let departmentIDResult = await departentInst.select("id", "name", departmentRole);
        let departmentIDRole = departmentIDResult[0].id;

        // Add the user input to the database
        let roleInst = new database("role");
        await roleInst.addToTable(`"${nameRole}", ${salaryRole}, ${departmentIDRole}`)
        console.log(`Added ${nameRole} to the Database.`);
        initialQuestions();
      }
    )
}


async function addAEmployee() {
  // Create a role title array
  let roleTitleArray = [];

  // Get the values from role
  let roleInst = new database("role");
  let roleTitle = await roleInst.select("title")

  // Get all the department names from the database and push it into an array
  Object.entries(roleTitle).forEach(
    ([key, value]) => roleTitleArray.push(value.title)
  );

  // Create a employee manager array
  let employeeManagerArray = [];

  // Get the values from employee - Search for null to find manager
  let employeeInst = new database("employee");
  let employeeManagerLastName = await employeeInst.select("last_name", "manager_id", "null");

  // Get all the department names from the database and push it into an array
  Object.entries(employeeManagerLastName).forEach(
    ([key, value]) => employeeManagerArray.push(value.last_name)
  );

  // Add None option to the array
  employeeManagerArray.unshift("None (they are the manager)");

  inquirer.prompt([
    {
      type: "input",
      name: "firstNameEmployee",
      message: "What is the employee's first name?"
    },
    {
      type: "input",
      name: "lastNameEmployee",
      message: "What is the employee's last name?"
    },
    {
      type: "list",
      name: "roleEmployee",
      message: "What is the employee's role?",
      choices: roleTitleArray
    },
    {
      type: "list",
      name: "managerEmployee",
      message: "Who is the employee's manager?",
      choices: employeeManagerArray
    }
  ])
    .then(
      async function (roleAnswer) {

        // Get user input for each question
        let { firstNameEmployee: firstName, lastNameEmployee: lastName, roleEmployee: roleInput, managerEmployee: managerInput } = roleAnswer;


        // Get the id for the role user chose
        let roleIDResult = await roleInst.select("id", "title", roleInput);
        let roleIDRole = roleIDResult[0].id;

        // Declare the manager ID
        let employeeIDManager

        // Add a condition if the user chooses None for the manager:
        if (managerInput != "None (they are the manager)") {
          // Get the id for the employee user chose
          let employeeIDResult = await employeeInst.select("id", "last_name", managerInput);
          employeeIDManager = employeeIDResult[0].id;

        } else {
          // Get the id for the employee user chose
          employeeIDManager = null;
        }

        // Add the user input to the database
        await employeeInst.addToTable(`"${firstName}", "${lastName}", ${roleIDRole}, ${employeeIDManager}`)
        console.log(`Added ${firstName} ${lastName} to the Database.`);
        initialQuestions();
      }
    )
}

async function updateEmployee() {

  let employeeInst = new database("employee");
  let roleInst = new database("role");

  let firstNameArray = [];
  let lastNameArray = [];
  let roleTitleArray = [];
  // let firstAndLastNameArray = [];


  // Get employees first name

  let firstNameRole = await employeeInst.select("first_name");

  // Push the first names into an array
  Object.entries(firstNameRole).forEach(
    ([key, value]) => firstNameArray.push(value.first_name)
  );

  // Get employees last name
  let lastNameRole = await employeeInst.select("last_name");

  // Push the last names into an array
  Object.entries(lastNameRole).forEach(
    ([key, value]) => lastNameArray.push(value.last_name)
  );

  // Combine first and last names together
  let firstAndLastNameArray = lastNameArray.map((item, i) => firstNameArray[i].concat(` ${item}`));

  // Get all the role titles from database
  let roleTitle = await roleInst.select("title")
  // Push the role titles into an array
  Object.entries(roleTitle).forEach(
    ([key, value]) => roleTitleArray.push(value.title)
  );


  inquirer.prompt([
    // {
    //   type: "input",
    //   name: "firstNameEmployee",
    //   message: "What is the employee's first name?"
    // },
    {
      type: "list",
      name: "employeeName",
      message: "Which employee's role do you want to update?",
      choices: firstAndLastNameArray
    },
    {
      type: "list",
      name: "employeeRole",
      message: "Which role do you want to assign the selected employee?",
      choices: roleTitleArray
    }
  ])
    .then(
      async function (roleAnswer) {

        // Get user input for each question
        let { employeeName: employeeNameSurnameInput, employeeRole: employeeRoleInput } = roleAnswer;
        
        // Find the name
        let employeeNameInput  = employeeNameSurnameInput.substring(0, employeeNameSurnameInput.indexOf(' '));

        // Find the employee the user chose in the employee table
        let employeeNameID = (await employeeInst.select("id", "first_name", employeeNameInput))[0].id;

        // Find the id for the role user chose
        let roleTitleID = (await roleInst.select("id", "title", employeeRoleInput))[0].id;

        // update the role ID for the employee using employee ID
        await employeeInst.update("role_id", roleTitleID, "id", employeeNameID);

        console.log(`Updated employee's role`);
        initialQuestions();

      })
}

// Function to generate readme file
async function init() {
  initialQuestions()
}

init();
