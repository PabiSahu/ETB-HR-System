// employeeController.js

const db = require('../database');

// Render the employee creation page
exports.renderEmployeeCreationPage = (req, res) => {
  const employeeId = req.session.employeeId; // Extract employeeId from query parameters

  const employeeDetails = req.employeeDetails;
  const errorMessage = ''; 
  res.render('employeeCreation', {
    employeeId,
    employeeDetails,
    employeeDetails: req.employeeDetails,
    errorMessage,
  });
};

// Process the creation of an employee
exports.processEmployeeCreation = (req, res) => {
  const {
    employeeId,
    first_name,
    last_name,
    gender,
    birth_date,
    contact_number,
    emergency_contact_number,
    office_email,
    personal_email,
    current_address,
    permanent_address,
    department,
    job_position,
    employee_rank,
    job_location,
    hire_date,
    start_date,
    end_date,
    manager_name,
    emp_image_name,
  } = req.body;

  // Check if the employeeId already exists in the database
  const checkEmployeeIdSql = "SELECT * FROM ETB_HR_EMPLOYEE_DETAILS1 WHERE EMPLOYEE_ID = ?";
  db.query(checkEmployeeIdSql, [employeeId], (err, result) => {
    if (err) {
      console.error('Error checking employee_id:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // If the employeeId already exists, show a validation message
      if (result.length > 0) {
        res.render('employeeCreation', {
          employeeId,
          employeeDetails: req.employeeDetails,
          errorMessage: 'Employee Profile already exists. Please choose a different Employee ID.',
        });
      } else {
        // If the employeeId doesn't exist, proceed with the insertion
        const empImage = req.file ? req.file.buffer : null;
        const empImageName = req.body.emp_image_name || null;

        const sql = "INSERT INTO ETB_HR_EMPLOYEE_DETAILS1 (EMPLOYEE_ID, FIRST_NAME, LAST_NAME, GENDER, BIRTH_DATE, CONTACT_NUMBER, EMERGENCY_CONTACT_NUMBER, OFFICE_EMAIL, PERSONAL_EMAIL, CURRENT_ADDRESS, PERMANENT_ADDRESS, DEPARTMENT, JOB_POSITION, EMPLOYEE_RANK, JOB_LOCATION, HIRE_DATE, START_DATE, END_DATE, MANAGER_NAME, EMP_IMAGE, EMP_IMAGE_NAME, CREATED_BY, LAST_UPDATED_BY) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          employeeId,
          first_name,
          last_name,
          gender,
          birth_date,
          contact_number,
          emergency_contact_number,
          office_email,
          personal_email,
          current_address,
          permanent_address,
          department,
          job_position,
          employee_rank,
          job_location,
          hire_date,
          start_date,
          end_date,
          manager_name,
          empImage,
          empImageName,
          'your_created_by_value',
          'your_last_updated_by_value',
        ];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Data inserted successfully!');
            // Redirect to the employee creation page with employeeId as a query parameter
            res.redirect('/employeeProfileCard1', `/employeeCreation?employeeId=${employeeId}`, {
              employeeDetails: req.employeeDetails,
            });
          }
        });
      }
    }
  });
};
