//  models/TimecardDashBoardModal.js
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ashu@123',
  database: 'etb_hrms_schema',
  connectionLimit: 50,
  port: 3306,
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Function to fetch timecard data from the database
function getTimecardData(callback) {
  let sql = `SELECT e.FIRST_NAME, e.LAST_NAME, t.TOTAL_HOURS
             FROM ETB_HR_PROJECT_TIMECARD_DETAILS t
             JOIN ETB_HR_EMPLOYEE_DETAILS1 e ON t.EMPLOYEE_ID = e.EMPLOYEE_ID`;

  // Execute the SQL query
  connection.query(sql, callback);
}

module.exports = { getTimecardData };
