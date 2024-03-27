// loginController.js
const bcrypt = require('bcrypt');
const connection = require('../database');
 
// Render login page
exports.renderLoginPage = (req, res) => {
    // Your logic for rendering the login page
    res.render('login', { emailError: '', passwordError: '' }); // Adjust this based on your template rendering setup
};
 
// Authenticate user during login
exports.authenticateUser = (req, res) => {
    const { EMAIL, PASSWORD } = req.body;
    const trimmedEmail = EMAIL.trim();
 
    // Validate the presence of both EMAIL and PASSWORD
    if (!trimmedEmail || !PASSWORD) {
        return res.render('login', {
            emailError: !trimmedEmail ? 'Please enter email' : '',
            passwordError: !PASSWORD ? 'Please enter password' : '',
        });
    }
 
    // Query the database to check if the email exists
    const sql = 'SELECT * FROM ETB_HR_REGISTER_FORM WHERE EMAIL = ?';
 
    connection.query(sql, [trimmedEmail], async (err, results) => {
        if (err) {
            console.error('Error during authentication:', err);
            return res.status(500).send('Internal Server Error');
        }
 
        console.log('Entered email:', trimmedEmail);
 
        if (results.length > 0) {
            // Compare the entered password with
            // the hashed password from the database
            const hashedPassword = results[0].PASSWORD;
 
            console.log('Entered password:', PASSWORD);
            console.log('Hashed password from the database:', hashedPassword);
 
            // Use bcrypt.compare to compare the passwords
            const passwordMatch = await bcrypt.compare(PASSWORD, hashedPassword);
 
            console.log('Password match:', passwordMatch);
 
            if (passwordMatch) {
                // Set session variables
                req.session.loggedIn = true;
                req.session.username = results[0].USERNAME; // Set the username in the session
                console.log('Session username:', req.session.username);
                console.log('Created by:', req.session.username);
                // Redirect to a protected route or render a dashboard
                res.redirect('home');
            } else {
                // Handle incorrect password
                return res.render('login', {
                    emailError: '',
                    passwordError: 'Invalid email or password',
                });
            }
        } else {
            // Handle email not found
            return res.render('login', {
                emailError: 'Email not found',
                passwordError: '',
            });
        }
    });
};