const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Ashu@123',
  database: 'etb_hrms_schema',
  port: 3306,
});

exports.getTableData = (req, res) => {
    const query = 'SELECT * FROM COA_RESPONSIBILITY';
  
    pool.query(query, (error, results) => {
      if (error) {
        throw error;
      }
  
      res.render('ResponsibilityTable', { data: results, employeeDetails: req.employeeDetails });
    });
  };

  exports.responsibilityupdate = (req, res) => {
    const { RESPONSIBILITY_ID, RESPONSIBILITY_NAME,ROLE_NAME, DESCRIPTION } = req.body;
  
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
  
      const query =
        'UPDATE COA_RESPONSIBILITY SET RESPONSIBILITY_NAME=?,ROLE_NAME=?, DESCRIPTION=?  WHERE RESPONSIBILITY_ID=?';
  
      const values = [RESPONSIBILITY_NAME,ROLE_NAME, DESCRIPTION, RESPONSIBILITY_ID];
  
      connection.query(query, values, (error, result) => {
        connection.release();
  
        if (error) {
          throw error;
        }
  
        res.redirect('/getTableData'); // Redirect to the page displaying all data after update
      });
    });
  };
  

