//registerController.js
 
const bcrypt = require('bcrypt');
const connectionPool = require('../database');
 
exports.renderUserRegisterPage = (req, res) => {
  const createdBy = req.session.username;
  const employeeDetails = req.employeeDetails;

  res.render('UserRegister', {
    createdBy,
    employeeDetails, 
    username: '',
    email: '',
    usernameError: '',  // Ensure this variable is defined
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
  });
};
 
exports.UserRegister = async (req, res) => {
  const { employee_id, username, email, password, confirmPassword } = req.body;
 
  // Validate password and confirmPassword match
  if (password !== confirmPassword) {
    return res.render('UserRegister', {
      createdBy: req.session.username,
      username,
      email,
      passwordError: 'Password and Confirm Password do not match',
      confirmPasswordError: '',
      // Ensure these variables are defined
      usernameError: '',
      emailError: '',
    });
  }
 
  // Validate minimum password length
  if (password.length < 8) {
    return res.render('UserRegister', {
      createdBy: req.session.username,
      username,
      email,
      passwordError: 'Password should be at least 8 characters long',
      confirmPasswordError: '',
      // Ensure these variables are defined
      usernameError: '',
      emailError: '',
    });
  }
 
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
 
  // Insert the new user
  const insertQuery =
    'INSERT INTO ETB_HR_REGISTER_FORM (employee_id, username, email, password, created_by, last_updated_by) VALUES (?, ?, ?, ?, ?, ?)';
  connectionPool.query(
    insertQuery,
    [employee_id, username, email, hashedPassword, req.session.username, req.session.username],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          // Handle duplicate key entry error
          return res.render('UserRegister', {
            createdBy: req.session.username,
            username,
            email,
            usernameError: 'Username is already registered',
            emailError: 'Email is already registered',
            passwordError: '',
            confirmPasswordError: '',
          });
        }
 
        console.error('Error during registration:', err);
        return res.render('UserRegister', {
          createdBy: req.session.username,
          message: 'An error occurred during registration',
          username,
          email,
          usernameError: '',
          emailError: '',
          passwordError: '',
          confirmPasswordError: '',
        });
      }
 
      // Log a message to the console
      console.log('Registration successful. Redirecting to the login page.');
 
      // Redirect to the login page after successful registration
      res.redirect('/UserRegister');
    }
  );
};