// childlookupRoutes.js

const express = require('express');
const router = express.Router();
const lookupController = require('../controllers/childlookupcontroller');

const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

// Define routes for fetching and inserting data into the child table
router.get('/childlookup', employeeDetailsMiddleware, lookupController.getFunction);
router.get('/childlookup/:masterValue', employeeDetailsMiddleware, lookupController.getChildDataByMasterValue);

// Route for Inserting child data
router.post('/insert-child', employeeDetailsMiddleware, lookupController.insertChildData);

// Add route for deleting a single row
router.delete('/delete-child/:childId', employeeDetailsMiddleware, lookupController.deleteChild);

// Add route for deleting multiple rows
router.delete('/delete-multiple-children', employeeDetailsMiddleware, lookupController.deleteMultipleChildren);

// Route for submitting the form data in master_lookup table
router.post('/submitForm', employeeDetailsMiddleware, lookupController.submitForm);

// route for deleting master_lookup
router.delete('/delete-master/:masterValue', employeeDetailsMiddleware, lookupController.deleteMaster);

// Route for updating master_lookup
router.put('/update-master', employeeDetailsMiddleware, lookupController.updateMaster);
router.post('/update-child', employeeDetailsMiddleware, lookupController.updateChild);

module.exports = router;
