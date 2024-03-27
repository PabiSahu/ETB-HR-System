// registerRoutes.js
const express = require('express');
const router = express.Router();
const UserRegisterController = require('../controllers/UserRegisterController');

const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

router.get('/UserRegister',employeeDetailsMiddleware, UserRegisterController.renderUserRegisterPage);
router.post('/UserRegister',employeeDetailsMiddleware, UserRegisterController.UserRegister);

module.exports = router;
