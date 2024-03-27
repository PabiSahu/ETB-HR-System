// routes.js

const express = require('express');
const router = express.Router();
const TableController = require('../controllers/TableController');

const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

// Define route to get all data from the table
router.get('/getAllData', employeeDetailsMiddleware, TableController.getAllData);
router.post('/updateRecord', employeeDetailsMiddleware, TableController.updateRecord); // Changed to PUT for updating records


module.exports = router;
