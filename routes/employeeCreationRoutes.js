const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');
 
const multer = require('multer'); // Import multer
 
 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
 
router.get('/employeeCreation',employeeDetailsMiddleware, employeeController.renderEmployeeCreationPage);
router.post('/process_employee_creation', multer().single('emp_image'),employeeDetailsMiddleware, employeeController.processEmployeeCreation);
 
module.exports = router;