

const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'Ashu@123',
        database: 'etb_hrms_schema',
        connectionLimit: 50,
        port: 3306,
});

// Function to execute queries
function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

module.exports = {
  executeQuery,
};
