const mysql = require('mysql2/promise');
const multer = require('multer');
const upload = multer();
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Ashu@123',
  database: 'etb_hrms_schema',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
async function saveExperience(req, res) {
  // Extract data from the request
  const {
    EMPLOYEE_ID,
    FIRST_NAME,
    LAST_NAME,
    PERSONAL_EMAIL,
    PREVIOUS_COMPANY_NAME,
    DESIGNATION,
    ROLE,
    EXPERIENCE,
    COMPANY_ADDRESS,
    START_DATE,
    END_DATE,
  } = req.body;

  // Handle the file upload (assuming you're using multer)
  const DOCUMENT = req.file ? req.file.buffer : null;

  // Ensure all values are defined or set default values
  const values = [
    FIRST_NAME || null,
    LAST_NAME || null,
    PERSONAL_EMAIL || null,
    PREVIOUS_COMPANY_NAME || null,
    DESIGNATION || null,
    ROLE || null,
    EXPERIENCE || null,
    COMPANY_ADDRESS || null,
    START_DATE || null,
    END_DATE || null,
    DOCUMENT || null,
    EMPLOYEE_ID ||null,
  ];

  // Update the existing experience data
  const updateSql = `
    UPDATE employees_experience_details2
    SET 
      FIRST_NAME = ?,
      LAST_NAME = ?,
      PERSONAL_EMAIL = ?,
      PREVIOUS_COMPANY_NAME = ?,
      DESIGNATION = ?,
      ROLE = ?,
      EXPERIENCE = ?,
      COMPANY_ADDRESS = ?,
      START_DATE = ?,
      END_DATE = ?,
      DOCUMENT = ?
    WHERE EMPLOYEE_ID = ?
  `;

  try {
    const [results, fields] = await pool.execute(updateSql, values);
    console.log('Rows affected:', results.affectedRows);
    console.log('experience data saved successfully');
    console.log('Update Values:', values);
    res.redirect('/employeeDetails',{employeeDetails: req.employeeDetails });
  } catch (error) {
    console.error('Error saving education data:', error);
    return res.json({ success: false, error: 'Failed to save education data.' });
  }
  }
  

async function updateEducation(req, res) {
  // Extract data from the request
  const {
    EMP_EDUCATION_ID,
    EDUCATION_TYPE,
    QUALIFICATION,
    UNIVERSITY_NAME,
    INSTITUTE_NAME,
    YEAR_OF_PASSING,
    INSTITUTE_ADDRESS,
    E_STATE,
    COUNTRY,
    E_START_DATE,
    E_END_DATE,
    
  } = req.body;

  // Handle the file upload for education document (assuming you're using multer)
  const E_DOCUMENT = req.file ? req.file.buffer : null;

  // Ensure all values are defined or set default values
  const values = [
    EDUCATION_TYPE || null,
    QUALIFICATION || null,
    UNIVERSITY_NAME || null,
    INSTITUTE_NAME || null,
    YEAR_OF_PASSING || null,
    INSTITUTE_ADDRESS || null,
    E_STATE || null,
    COUNTRY || null,
    E_START_DATE || null,
    E_END_DATE || null,
    E_DOCUMENT || null,
    EMP_EDUCATION_ID || null
  ];

  // update  new education details
  const Sql = `
  UPDATE EDUCATION_DETAILS
  SET  
    EDUCATION_TYPE = ?,
    QUALIFICATION = ?,
    UNIVERSITY_NAME = ?,
    INSTITUTE_NAME = ?,
    YEAR_OF_PASSING = ?,
    INSTITUTE_ADDRESS = ?,
    E_STATE = ?,
    COUNTRY = ?,
    E_START_DATE = ?,
    E_END_DATE = ?,
    E_DOCUMENT = ?
  WHERE EMP_EDUCATION_ID=?
`;
try {
  const [results, fields] = await pool.execute(Sql, values);
  console.log('Rows affected:', results.affectedRows);
  console.log('Education data saved successfully');
  console.log('Update Values:', values);
  res.redirect('/employeeDetails',{employeeDetails: req.employeeDetails });
} catch (error) {
  console.error('Error saving education data:', error);
  return res.json({ success: false, error: 'Failed to save education data.' });
}
}

async function getEmployeeData(employeeId) {
  // Ensure employeeId is defined or set it to null if undefined
  employeeId = employeeId || '';

  // console.log('Values:', [employeeId]); // Logging for debugging
  const sql = `
    SELECT * 
    FROM ETB_HR_EMPLOYEE_DETAILS1 AS emp
    JOIN employees_experience_details2 AS exp ON emp.EMPLOYEE_ID = exp.EMPLOYEE_ID
    JOIN EDUCATION_DETAILS AS edu ON emp.EMPLOYEE_ID = edu.EMP_EDUCATION_ID;
  `;
  try {
    const [rows, fields] = await pool.execute(sql, [employeeId]);
    return rows;
  } catch (error) {
    console.error('Error fetching employee data:', error);
    throw error; // Re-throw the error for handling it in the calling function or route
  }
}
module.exports = { saveExperience, updateEducation, getEmployeeData };
