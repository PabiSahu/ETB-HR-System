const express = require('express');
const router = express.Router();
const employeeDetailsCollector = require('../controllers/employeeDetailsCollector');

router.get('/employeeDetails', async (req, res) => {
  try {
    const employees = await employeeDetailsCollector.getEmployeeData();
    res.render('employeeDetails', {  employees: employees });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/saveExperience', employeeDetailsCollector.saveExperience);
router.post('/saveEducation', employeeDetailsCollector.updateEducation);

module.exports = router;
