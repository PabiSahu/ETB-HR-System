// routes/employeeRouter.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
  user: 'root',
  password: 'Ashu@123',
  database: 'etb_hrms_schema',
  port: 3306,
});
// routes/employeeRouter.js
router.get('/employeeProfileCard1', (req, res) => {
  const query = 'SELECT * FROM ETB_HR_EMPLOYEE_DETAILS1';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data from the database: ' + error.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Fetched data from the database:', results); // Add this line

    // Pass the 'employees' variable to the view
    res.render('employeeProfileCard1', { employees: results });
  });
});


module.exports = router;
