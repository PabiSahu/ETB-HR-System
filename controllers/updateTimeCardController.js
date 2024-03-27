// updateTimeCardController.js
 
 
 
// **********************************************************
 
 
 
const mysql = require('mysql');
const bcrypt = require('bcrypt');
 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Ashu@123',
  database: 'etb_hrms_schema',
  port: 3306,
});
 
// Function to get and render the time card data
exports.getupdateTimeCard = (req, res) => {
    const query = 'SELECT * FROM ETB_HR_PROJECT_TIMECARD_DETAILS';
 
    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching time cards:', error);
        res.status(500).send('Internal Server Error');
        return;
      }
 
      res.render('updateTimeCard', { data: results });
    });
};
 
// Method to approve time card
exports.approveTimeCard = async (req, res) => {
    const projtimeCardId = req.params.projtimeCardId;
 
    try {
        // Implement your logic to update the time card status to approved in the database
        // You may use a service or a database query here
 
        // Example: Update time card status to approved in the database
        // const updateQuery = 'UPDATE ETB_HR_PROJECT_TIMECARD_DETAILS SET STATUS_ID = (select Child_id from Child_Lookup where child_Lookup_Name = "approved") WHERE TIME_CARD_ID = ?';
        // await pool.query(updateQuery, [projtimeCardId]);
 
        const updateQuery = 'UPDATE ETB_HR_PROJECT_TIMECARD_DETAILS SET STATUS_ID = (SELECT Child_id FROM Child_Lookup WHERE Lookup_Values = "approved") WHERE PROJ_TIMECARD_ID = ?';
        await pool.query(updateQuery, [projtimeCardId]);
 
        res.redirect('/getupdateTimeCard'); // Redirect to the time card approval page after approval
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
 
exports.rejectTimeCard = async (req, res) => {
  const projtimeCardId = req.params.projtimeCardId;
 
  try {
      // Implement your logic to update the time card status to rejected in the database
      // You may use a service or a database query here
 
      // Example: Update time card status to rejected in the database
      // const updateQuery = 'UPDATE ETB_HR_PROJECT_TIMECARD_DETAILS SET STATUS_ID = (select Child_id from Child_Lookup where Lookup_Values = "rejected") WHERE TIME_CARD_ID = ?';
      // await pool.query(updateQuery, [projtimeCardId]);
 
      const updateQuery = 'UPDATE ETB_HR_PROJECT_TIMECARD_DETAILS SET STATUS_ID = (SELECT Child_id FROM Child_Lookup WHERE Lookup_Values = "rejected") WHERE PROJ_TIMECARD_ID = ?';
      await pool.query(updateQuery, [projtimeCardId]);
 
      res.redirect('/getupdateTimeCard'); // Redirect to the time card approval page after rejection
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
};
 