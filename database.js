// var mysql = require('mysql2');

// var connection = mysql.createConnection({
//   host: "localhost",
//   database:"hrms",
//   user: "root",
//   password: "Abid@405"
// });

// module.exports = connection;

const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  database: "etb_hrms_schema",
  user: "root",
  password: "Ashu@123",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port:3306
});
// Export the pool instead of the connection
module.exports = pool;

