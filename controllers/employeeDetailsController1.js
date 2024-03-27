const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  user: 'root',
  password: 'Ashu@123',
  database: 'etb_hrms_schema',
  port: 3306,
});

const getEmployeeDetails1 = (req, res) => {
  const employeeId = req.params.employeeId;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    const query = 'SELECT * FROM ETB_HR_EMPLOYEE_DETAILS1 WHERE EMPLOYEE_ID = ?';
    connection.query(query, [employeeId], (error, employeeDetails1) => {
      if (error) {
        connection.release();
        console.error('Error fetching employee details: ' + error.stack);
        res.status(500).send('Internal Server Error: ' + error.message);
        return;
      }

      const educationQuery = 'SELECT * FROM EDUCATION_DETAILS WHERE EMP_EDUCATION_ID = ?';
      connection.query(educationQuery, [employeeId], (eduError, educationDetails) => {
        if (eduError) {
          connection.release();
          console.error('Error fetching education details: ' + eduError.stack);
          res.status(500).send('Internal Server Error: ' + eduError.message);
          return;
        }

        const experienceQuery = 'SELECT * FROM employees_experience_details2 WHERE EMPLOYEE_ID = ?';
        connection.query(experienceQuery, [employeeId], (expError, experienceDetails) => {
          if (expError) {
            connection.release();
            console.error('Error fetching experience details: ' + expError.stack);
            res.status(500).send('Internal Server Error: ' + expError.message);
            return;
          }

          // Add the certification query here
          const certificationQuery = 'SELECT * FROM CERTIFICATION_TRAINING WHERE EMPLOYEE_ID = ?';
          connection.query(certificationQuery, [employeeId], (certError, certificationDetails) => {
            connection.release();
            if (certError) {
              console.error('Error fetching certification details: ' + certError.stack);
              res.status(500).send('Internal Server Error: ' + certError.message);
              return;
            }

            res.render('employeeDetails1', {
              employee: employeeDetails1[0],
              education: educationDetails,
              experience: experienceDetails,
              certification: certificationDetails, 
              
            });
          });
        });
      });
    });
  });
}

const updateEducationDetails = (req, res) => {
    const employeeId = req.params.employeeId; // Update parameter name to 'employeeId'
    const updatedData = req.body;
  
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection from pool: ' + err.stack);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      const educationUpdateQuery =
        'UPDATE EDUCATION_DETAILS SET EDUCATION_TYPE = ?, QUALIFICATION = ?, UNIVERSITY_NAME = ?,INSTITUTE_NAME=?,YEAR_OF_PASSING=?,INSTITUTE_ADDRESS=?,E_STATE=?,COUNTRY=?,E_START_DATE=?,E_END_DATE=? WHERE EMP_EDUCATION_ID = ?';
  
      const educationValues = [
        updatedData.EDUCATION_TYPE,
        updatedData.QUALIFICATION,
        updatedData.UNIVERSITY_NAME,
        updatedData.INSTITUTE_NAME,
        updatedData.YEAR_OF_PASSING,
        updatedData.INSTITUTE_ADDRESS,
        updatedData.E_STATE,
        updatedData.COUNTRY,
        updatedData.E_START_DATE,
        updatedData.E_END_DATE,
        employeeId,
      ];
  
      connection.query(educationUpdateQuery, educationValues, (eduUpdateError, edu) => {
        connection.release();
        if (eduUpdateError) {
          console.error('Error updating education details: ' + eduUpdateError.stack);
          res.status(500).send('Internal Server Error: ' + eduUpdateError.message);
          return;
        }
        res.redirect(`/employeeDetails1/${employeeId}`);
        // res.status(200).send('Education details updated successfully');
      });
    });
  };
  
  const updateExperienceDetails = (req, res) => {
    const employeeId = req.params.employeeId;
    const updatedData = req.body;
  
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection from pool: ' + err.stack);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      const experienceUpdateQuery =
        'UPDATE employees_experience_details2 SET PREVIOUS_COMPANY_NAME = ?, DESIGNATION = ?, ROLE = ?,EXPERIENCE=?,COMPANY_ADDRESS=?,START_DATE=?,END_DATE=? WHERE EMPLOYEE_ID = ?';
  
      const experienceValues = [
        updatedData.PREVIOUS_COMPANY_NAME,
        updatedData.DESIGNATION,
        updatedData.ROLE,
        updatedData.EXPERIENCE,
        updatedData.COMPANY_ADDRESS,
        updatedData.START_DATE,
        updatedData.END_DATE,
        employeeId,
      ];
  
      connection.query(experienceUpdateQuery, experienceValues, (expUpdateError, exp) => {
        connection.release();
        if (expUpdateError) {
          console.error('Error updating experience details: ' + expUpdateError.stack);
          res.status(500).send('Internal Server Error: ' + expUpdateError.message);
          return;
        }
        res.redirect(`/employeeDetails1/${employeeId}`);
        // res.status(200).send('Experience details updated successfully');
      });
    });
  };
  const updatePersonalDetails = (req, res) => {
    const employeeId = req.params.employeeId; // Update parameter name to 'employeeId'
    const updatedData = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        const personalUpdateQuery =
            'UPDATE ETB_HR_EMPLOYEE_DETAILS1 SET GENDER=?,BIRTH_DATE=?, CONTACT_NUMBER=?, TOWN_OF_BIRTH=?, AADHAR_CARD=?, PAN_CARD=?, MOTHER_TONGUE=?, ANY_DISABLED=?, CURRENT_ADDRESS=?, STATE=?, COUNTRY=? WHERE EMPLOYEE_ID=?';

        const personalValues = [
            updatedData.GENDER,
            updatedData.BIRTH_DATE,
            updatedData.CONTACT_NUMBER,
            updatedData.TOWN_OF_BIRTH,
            updatedData.AADHAR_CARD,
            updatedData.PAN_CARD,
            updatedData.MOTHER_TONGUE,
            updatedData.ANY_DISABLED,
            updatedData.CURRENT_ADDRESS,
            updatedData.STATE,
            updatedData.COUNTRY,
            employeeId,
        ];

        connection.query(personalUpdateQuery, personalValues, (personalUpdateError, personal) => {
            connection.release();
            if (personalUpdateError) {
                console.error('Error updating personal details: ' + personalUpdateError.stack);
                res.status(500).send('Internal Server Error: ' + personalUpdateError.message);
                return;
            }
            res.redirect(`/employeeDetails1/${employeeId}`);
            // res.status(200).send('Personal details updated successfully');
        });
    });
};
const updateCertificationDetails = (req, res) => {
  const employeeId = req.params.employeeId;
  const updatedData = req.body;

  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool: ' + err.stack);
          res.status(500).send('Internal Server Error');
          return;
      }

      const certificationUpdateQuery =
          'UPDATE CERTIFICATION_TRAINING SET CERTIFICATION_NAME = ?, ORGANIZATION = ?, COMPLETION_DATE = ?, VALIDITY_PERIOD = ?, CERTIFICATE_NUMBER = ? WHERE EMPLOYEE_ID = ?';

      const certificationValues = [
          updatedData.CERTIFICATION_NAME,
          updatedData.ORGANIZATION,
          updatedData.COMPLETION_DATE,
          updatedData.VALIDITY_PERIOD,
          updatedData.CERTIFICATE_NUMBER,
          employeeId,
      ];

      connection.query(certificationUpdateQuery, certificationValues, (certUpdateError, cert) => {
          connection.release();
          if (certUpdateError) {
              console.error('Error updating certification details: ' + certUpdateError.stack);
              res.status(500).send('Internal Server Error: ' + certUpdateError.message);
              return;
          }
          res.redirect(`/employeeDetails1/${employeeId}`);
          // res.status(200).send('Certification details updated successfully');
      });
  });
};  
module.exports = { getEmployeeDetails1, updateEducationDetails, updateExperienceDetails,updatePersonalDetails,updateCertificationDetails };
  
  
