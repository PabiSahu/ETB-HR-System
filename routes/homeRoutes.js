// // homeRoutes.js
// const express = require('express');
// const router = express.Router();

// // Import the corresponding controller
// const homeController = require('../controllers/homeController');

// // Define the 'home' route
// router.get('/home', homeController.renderHomePage);

// // Export the router
// module.exports = router;


// routes/homeRoutes.js

const express = require('express');
const homeController = require('../controllers/homeController');
const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

const router = express.Router();

router.get('/home',employeeDetailsMiddleware, homeController.getHomePage);
module.exports = router;
