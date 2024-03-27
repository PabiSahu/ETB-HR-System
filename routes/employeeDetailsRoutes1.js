// employeeDetailsRoutes.js
const express = require('express');
const router = express.Router();
const employeeDetailsController1 = require('../controllers/employeeDetailsController1');

router.get('/employeeDetails1/:employeeId', employeeDetailsController1.getEmployeeDetails1);
router.post('/updateEducationDetails/:employeeId', employeeDetailsController1.updateEducationDetails);
router.post('/updateExperienceDetails/:employeeId', employeeDetailsController1.updateExperienceDetails);
router.post('/updatePersonalDetails/:employeeId', employeeDetailsController1.updatePersonalDetails);
router.post('/updateCertificationDetails/:employeeId', employeeDetailsController1.updateCertificationDetails);
module.exports = router;


