// forgotPasswordController.js
const connection = require('../database');
const nodemailer = require('nodemailer');

// Define a simple function to generate a random captcha
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const captchaLength = 6;
    let captcha = '';

    for (let i = 0; i < captchaLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        captcha += characters.charAt(randomIndex);
    }

    return captcha;
}

exports.renderForgotPasswordPage = (req, res) => {
    // Generate or retrieve the captcha value
    const captcha = generateCaptcha(); // Replace this with your captcha generation logic

    // Render the forgotpassword view and pass the captcha variable
    res.render('forgotpassword', { captcha });
};

exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    const userQuery = 'SELECT * FROM ETB_HR_REGISTER_FORM WHERE email = ?';
    connection.query(userQuery, [email], async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // Generate and send OTP via Nodemailer
            const otp = generateOTP(); // Implement your OTP generation logic

            // Create a Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'abid14.esaq@gmail.com', // Removed extra space here
                  pass: 'rxmo koop jmeu kexg'
                }
            });

            // Define email options
            const mailOptions = {
                from: 'abid14.esaq@gmail.com', // Replace with your email
                to: email,
                subject: 'OTP Verification',
                text: `Your OTP is: ${otp}`
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending OTP:', error);
                    res.send('Error sending OTP');
                } else {
                    console.log('Email sent: ' + info.response);
                    // Save the OTP and email in the session for verification
                    req.session.otp = otp;
                    req.session.email = email;
                    res.redirect('/verify'); // Redirect to OTP verification page
                }
            });
        } else {
            res.send('Email not found');
        }
    });
};

// Helper function to generate a random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
