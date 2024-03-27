// models/leave_db.js

const mysql = require('mysql2/promise');
 
const db = mysql.createPool({
  host: 'localhost',
  database: 'etb_hrms_schema',
  user: 'root',
  password: 'Ashu@123',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3306,
});
 
// Ensure the connection to MySQL
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};
 
testConnection();
 
// Function to get LEAVE_ID based on employeeId and leaveTypeId
async function fetchLeaveData(employeeId, leaveTypeId) {
  try {
    // Perform a database query to get LEAVE_ID based on employeeId and leaveTypeId
    const [rows, fields] = await db.query('SELECT LEAVE_ID FROM ETB_HR_LEAVE_DETAIL_INFORMATION WHERE EMPLOYEE_ID = ? AND LEAVE_TYPE_ID = ? AND LEAVE_ID is', [employeeId, leaveTypeId]);
 
    // Extract leaveId from the result
    const leaveId = rows.length > 0 ? rows[0].LEAVE_ID : null;
 
    return leaveId;
  } catch (error) {
    console.error('Error fetching LEAVE_ID from the database:', error);
    throw error;
  }
}
 
// Export the function
module.exports = fetchLeaveData;
module.exports =db;

