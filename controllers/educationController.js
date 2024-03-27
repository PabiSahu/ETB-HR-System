// educationController.js
const connectionPool = require('../database');

exports.updateEducationDetails = (req, res) => {
  const {
    EMP_EDUCATION_ID,
    EDUCATION_TYPE,
    QUALIFICATION,
    UNIVERSITY_NAME,
    EDUCATION_ID,
  } = req.body;

  // Update query
  const sql = `UPDATE education_details
               SET EMP_EDUCATION_ID=?, EDUCATION_TYPE=?, QUALIFICATION=?, UNIVERSITY_NAME=?
               WHERE EDUCATION_ID=?`;

  const values = [EMP_EDUCATION_ID, EDUCATION_TYPE, QUALIFICATION, UNIVERSITY_NAME, EDUCATION_ID];

  // Execute the update query using the connectionPool
  connectionPool.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error updating education_details: ' + error.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Rows affected:', results.affectedRows);
    console.log('Education details updated successfully');
    res.send('Education details updated successfully');
  });
};