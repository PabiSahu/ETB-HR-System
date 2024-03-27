// // routes/routes.js
// const express = require('express');
// const HomeDashBoardController = require('../controllers/HomeDashBoardController');

// const router = express.Router();

// router.get('/home', HomeDashBoardController.getEmployeeData);

// module.exports = router;


// routes/dashboardRoutes.js
const express = require('express');
const dashboardController = require('../controllers/HomeDashBoardController');





const router = express.Router();

// Endpoint to fetch leave data based on time period
router.get('/leaveData', dashboardController.getLeaveData);

router.get('/leaveTodayData', dashboardController.getAbsentEmployees);

// Endpoint to render the home page with employee data
router.get('/home', dashboardController.getEmployeeData);

router.get('/data', dashboardController.getTimecard);

module.exports = router;
