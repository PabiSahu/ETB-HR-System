const mysql = require('mysql');
const bcrypt = require('bcrypt');
const connectionPool = require('../database');

exports.getAllData = (req, res) => {
  const employeeDetails = req.employeeDetails; // Get employee details from middleware

  connectionPool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }

    const query = 'SELECT * FROM ETB_HR_REGISTER_FORM';

    connection.query(query, (error, results) => {
      connection.release();

      if (error) {
        throw error;
      }

      res.render('UserRegisterTable', { data: results, employeeDetails: employeeDetails });
    });
  });
};

exports.updateRecord = (req, res) => {
  const { EMAIL, PASSWORD, confirmPassword, REGISTER_ID } = req.body;

  // Check if the password and confirmation password match
  if (PASSWORD !== confirmPassword) {
    return res.status(400).send('Password and confirmation password do not match');
  }

  connectionPool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }

    // Hash the new password using bcrypt
    bcrypt.hash(PASSWORD, 8, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error(hashErr);
        connection.release();
        return res.status(500).send('Error hashing password');
      }

      const query =
        'UPDATE ETB_HR_REGISTER_FORM SET EMAIL=?, PASSWORD=? WHERE REGISTER_ID=?';
      const values = [EMAIL, hashedPassword, REGISTER_ID];

      connection.query(query, values, (error, result) => {
        connection.release();

        if (error) {
          throw error;
        }

        res.redirect('/getAllData'); // Redirect to the page displaying all data after update
      });
    });
  });
};
