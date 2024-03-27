// routes/timecardEntryRoutes.js
// timeCardRoutes.js
const express = require('express');
const router = express.Router();
const timeCardEntryController = require('../controllers/timeCardEntryController');
const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');
 
router.get('/create-time-card',employeeDetailsMiddleware, timeCardEntryController.getCreateTimeCard);
 
// router.post('/updateTimeCardEntry', timeCardEntryController.updateTimecard);
// router.put('/updateRow/:id', timeCardEntryController.updateRow);
 
router.post('/deleteTimeCard',employeeDetailsMiddleware, timeCardEntryController.postDeleteTimeCard); // Add this route
 
router.post('/addTimeCard',employeeDetailsMiddleware, timeCardEntryController.postAddTimeCard);
module.exports = router;



