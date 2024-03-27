// employeeDetailsMiddleware.js

const connectionPool = require('./database');

const employeeDetailsMiddleware = (req, res, next) => {
  const employeeId = req.session.employeeId;

  const query = 'SELECT EMPLOYEE_ID, FIRST_NAME, LAST_NAME, GENDER, EMP_IMAGE, OFFICE_EMAIL, CONTACT_NUMBER, DEPARTMENT, JOB_POSITION, JOB_LOCATION FROM ETB_HR_EMPLOYEE_DETAILS1 WHERE EMPLOYEE_ID = ?';

  connectionPool.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching employee details:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      const employeeDetails = results[0];
 
      // Convert the BLOB image data to Base64
      const imageBuffer = employeeDetails.EMP_IMAGE;
      if (imageBuffer) {
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');
        employeeDetails.EMP_IMAGE_BASE64 = imageBase64;
      }

      req.employeeDetails = employeeDetails;
      next();
    } else {
      console.error('Employee not found for employeeId:', employeeId);
      res.status(404).send('Employee not found');
    }
  });
};

module.exports = employeeDetailsMiddleware;
