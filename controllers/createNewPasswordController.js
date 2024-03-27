// createNewPasswordController.js

const bcrypt = require('bcrypt');
const connection = require('../database');

exports.renderCreateNewPasswordPage = (req, res) => {
    res.render('createNewPassword');
};

exports.processChangePassword = async (req, res) => {
    const { newPassword, confirmNewPassword } = req.body;

    // Check if the new password and confirm password match
    if (newPassword !== confirmNewPassword) {
        return res.send('Passwords do not match');
    }

    // Check if the user is logged in and has the necessary session information
    if (!req.session.email || !req.session.otp) {
        return res.send('Invalid session. Please initiate the password change process again.');
    }

    try {
        // Hash the new password securely
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database for the user
        const email = req.session.email;
        const updateQuery = 'UPDATE ETB_HR_REGISTER_FORM SET PASSWORD = ? WHERE EMAIL = ?';

        connection.query(updateQuery, [hashedPassword, email], (err, results) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.send('Error updating password');
            }

            // Clear session variables used during password change
            delete req.session.email;
            delete req.session.otp;

            res.redirect('/'); // Redirect to the login page or another appropriate page
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.send('Error updating password');
    }
};
