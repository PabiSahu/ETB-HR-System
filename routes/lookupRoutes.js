//lookupRoutes.js
 
const express = require('express');
const router = express.Router();
const lookupController = require('../controllers/lookupController');
 
const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

// Route to fetch and display the master and child lookup tables
router.get('/lookup',employeeDetailsMiddleware, lookupController.displayLookupTables);
 
 
 
module.exports = router;