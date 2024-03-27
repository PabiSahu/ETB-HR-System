// employeeDetailsRoutes.js
const express = require('express');
const router = express.Router();
const employeeController1 = require('../controllers/employeeController1');

// const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

router.get('/employeeProfileCard1', employeeController1.getEmployeeProfileCard1);

module.exports = router;
