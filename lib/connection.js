const mysql = require('mysql2');
require('dotenv').config()

// // Connection constructor to the database
// class Connection {
//     constructor() {
//         // Make a connection to the database
//         try {
//             this.db = mysql.createConnection(
//                 {
//                     host: 'localhost',
//                     // MySQL username,
//                     user: process.env.DB_USER,
//                     // MySQL password
//                     password: process.env.DB_PASSWORD,
//                     database: process.env.DB_NAME
//                 },
//                 console.log(`Connected to the ${process.env.DB_NAME} database.`)
//             );
//         } catch (err) {
//             console.log(`Error connecting to the database: ${err}`);
//         }
//     }

//     // Select from database table
//     select(tableName) {
//         try {
//             this.db.query(`SELECT * FROM ${tableName}`, function (err, results) {
//                 console.log(results);
//             });
//         } catch (err) {
//             console.log(`Error selecting from the database table: ${tableName} and error is: ${err}`);
//         }
//     }

//     addToTable(tableName, valueArray) {
//         const { } = valueArray

//         try {

//             if (tableName === "department") {
//                 this.db.query(
//                     `INSERT INTO ${process.env.DB_NAME}.${tableName} (name)
//                     VALUES (${valueArray[0]}),`, function (err, results) {
//                     console.log(results);
//                 });
//             } else if(tableName === "role"){
//                 this.db.query(
//                     `INSERT INTO ${process.env.DB_NAME}.${tableName} (title, salary, department_id)
//                     VALUES (${valueArray[0], valueArray[1], valueArray[2]}),`, function (err, results) {
//                     console.log(results);
//                 });
//             }

//         } catch (err) {
//             console.log(`Error selecting from the database table: ${tableName} and error is: ${err}`);
//         }
//     }

//     // Select from the database table
//     delete() {
//         this.db.query(`DELETE FROM course_names WHERE id = ?`, 3, (err, result) => {
//             if (err) {
//                 console.log(err);
//             }
//             console.log(result);
//         });
//     }

// };

const dbConnection = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
)


// to be exported 
module.exports = dbConnection; 