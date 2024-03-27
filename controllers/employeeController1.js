const mysql = require('mysql');

const connection = mysql.createConnection({
  user: 'root',
  host: "localhost",
  password: 'Ashu@123',
  database: 'etb_hrms_schema',
  port: 3306,
});

const getEmployeeProfileCard1 = (req, res) => {
  // Extract employeeId from the session
  const employeeId = req.session.employeeId;

  // Ensure that employeeDetails is defined or set to an empty object
  // const employeeDetails = req.employeeDetails || {};

  console.log('Employee ID from session:', employeeId);

  // Use a parameterized query to prevent SQL injection
  const query = 'SELECT * FROM ETB_HR_EMPLOYEE_DETAILS1 WHERE EMPLOYEE_ID= ?';
  connection.query(query, [employeeId], (error, results) => {
    if (error) {
      console.error('Error fetching data from the database: ' + error.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Fetched data from the database:', results);

    // Assuming you have an employeeProfileCard1.ejs view
    res.render('employeeProfileCard1', { employee: results[0] });
  });
};

module.exports = { getEmployeeProfileCard1 };
