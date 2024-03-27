// routes/leaveRoutes.js
const express = require('express');
const LeaveController = require('../controllers/leaveController');

// const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');
 

const router = express.Router();

router.get('/getLeaveId1', LeaveController.getLeaveId1);

// Define your leave-related routes
router.get('/leaveDetails', LeaveController.getLeaveDetails);
//router.post('/fetchLeaveData', LeaveController.fetchLeaveData);
router.post('/applyLeave', LeaveController.applyLeave);
router.get('/leaveTypeLovValues', LeaveController.getLeaveTypeLovValues);

// Add leave approval routes
router.get('/leaveApproval', LeaveController.getLeaveApprovalDetails);
router.post('/approveLeave/:leaveApprovalId', LeaveController.approveLeave);
router.post('/rejectLeave/:leaveApprovalId', LeaveController.rejectLeave);
// routes/leaveRoutes.js

router.get('/getLeaveBalanceData', LeaveController.getLeaveBalanceData);

router.get('/calculateLeaveBalance',LeaveController.calculateLeaveBalance);
module.exports = router;



