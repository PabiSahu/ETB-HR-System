// fetchEmployeeId.js
const connectionPool = require('./database');
 
const fetchEmployeeId = (req, res, next) => {
  const username = req.session.username;
 
  const query = 'SELECT EMPLOYEE_ID FROM ETB_HR_REGISTER_FORM WHERE USERNAME = ?';
  connectionPool.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching employee ID:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length > 0) {
      req.session.employeeId = results[0].EMPLOYEE_ID;
      console.log(req.session.employeeId);
      next();
    } else {
      return res.status(404).send('Employee ID not found for the given username');
    }
  });
};
 
module.exports = fetchEmployeeId;