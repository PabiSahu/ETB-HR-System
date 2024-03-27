// forgotPasswordRoutes.js
const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

router.get('/forgotpassword', forgotPasswordController.renderForgotPasswordPage);
router.post('/send-otp', forgotPasswordController.sendOTP);

module.exports = router;
