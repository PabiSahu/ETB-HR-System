const express = require('express');
const router = express.Router();
const UserRegisterTableController = require('../controllers/UserRegisterTableController'); // Replace with the actual path to your controller file

const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

router.get('/getTableData',employeeDetailsMiddleware, UserRegisterTableController.getTableData);
router.post('/responsibilityupdate',employeeDetailsMiddleware, UserRegisterTableController.responsibilityupdate);

module.exports = router;