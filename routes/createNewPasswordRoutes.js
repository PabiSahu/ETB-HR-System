// createNewPasswordRoutes.js
const express = require('express');
const router = express.Router();
const changePasswordController = require('../controllers/createNewPasswordController');


router.get('/createNewPassword', changePasswordController.renderCreateNewPasswordPage);
router.post('/changePassword', changePasswordController.processChangePassword);

module.exports = router;
