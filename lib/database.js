const connection = require('./connection');
require('dotenv').config();
// const databaseTable = "department";
// const columns = "name";

class Database {
    constructor(databaseTable) {
        this.db = connection;
        this.databaseTable = databaseTable;
        if (this.databaseTable === "department") {
            this.columns = "name";
        } else if (this.databaseTable === "role") {
            this.columns = "title, salary, department_id";
        } else if (this.databaseTable === "employee") {
            this.columns = "first_name, last_name, role_id, manager_id";
        }
    }

    addToTable(value) {
        return new Promise((resolve, reject) => {
            console.log(`INSERT INTO ${process.env.DB_NAME}.${this.databaseTable} (${this.columns}) VALUES (${value})`);
            this.db.query(
                `INSERT INTO ${process.env.DB_NAME}.${this.databaseTable} (${this.columns}) VALUES (${value})`, function (err, results) {
                    resolve(results);
                    // May need to return ID
                });
        });
    };
    // Select from database table
    select(column, whereColumn, whereValue) {
        return new Promise((resolve, reject) => {
            if (!column) {
                try {
                    this.db.query(`SELECT * FROM ${this.databaseTable}`, function (err, results) {
                        resolve(results);
                    });
                } catch (err) {
                    console.log(`Error selecting from the database table: ${this.databaseTable} and error is: ${err}`);

                }
            } else if (column && !whereColumn && !whereValue) {
                try {
                    this.db.query(`SELECT ${column} FROM ${this.databaseTable}`, function (err, results) {
                        resolve(results);
                    });
                } catch (err) {
                    console.log(`Error selecting from the database table: ${this.databaseTable} and error is: ${err}`);
                }
            } else if (column && whereColumn && whereValue) {
                try {
                    if (whereValue != "null") {
                        this.db.query(`SELECT ${column} FROM ${this.databaseTable} where ${whereColumn}="${whereValue}";`, function (err, results) {
                            // console.log(results);
                            resolve(results);
                        });
                    } else {
                        this.db.query(`SELECT ${column} FROM ${this.databaseTable} where ${whereColumn} is null;`, function (err, results) {
                            // console.log(results);
                            resolve(results);
                        });
                    }

                } catch (err) {
                    console.log(`Error selecting from the database table: ${this.databaseTable} and error is: ${err}`);
                }
            }
        });
    };
    update(setField, setValue, whereField, whereValue) {
        return new Promise((resolve, reject) => {
            try {
                this.db.query(`UPDATE ${this.databaseTable} SET ${setField} = '${setValue}' WHERE ${whereField} = "${whereValue}";`, function (err, results) {
                    resolve(results);
                });
            } catch (err) {
                console.log(`Error updating the database table: ${this.databaseTable} and error is: ${err}`);
            }
        })
    }

    join() {
        return new Promise((resolve, reject) => {
            try {
                this.db.query(
                    `SELECT E.ID, E.FIRST_NAME, E.LAST_NAME, R.TITLE, D.NAME AS DEPARTMENT, R.SALARY, IFNULL(concat(E2.FIRST_NAME," ", E2.LAST_NAME), "MANAGER") AS MANAGER FROM employee_tracker.EMPLOYEE E 
                INNER JOIN employee_tracker.ROLE R ON E.ROLE_ID=R.ID
                INNER JOIN employee_tracker.department D ON R.DEPARTMENT_ID=D.ID
                LEFT OUTER JOIN employee_tracker.EMPLOYEE E2 ON E.MANAGER_ID=E2.ID`,
                    function (err, results) {
                        resolve(results);
                    });
            } catch (err) {
                console.log(`Error updating the database table: ${this.databaseTable} and error is: ${err}`);
            }
        })
    };
}
// to be exported 
module.exports = Database;