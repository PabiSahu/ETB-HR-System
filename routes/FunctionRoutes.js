// FunctionRoutes.js

const express = require('express');
const router = express.Router();

// Import the FunctionController
const FunctionController = require('../controllers/FunctionController');

const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

// GET route to render the HTML page
// router.get('/Function', (req, res) => {
//     // Your logic for rendering the FunctionForm page
//     res.render('Function'); // Adjust this based on your template rendering setup
// });

router.get('/Function',employeeDetailsMiddleware, FunctionController.renderFunctionPage);
// POST route to handle function creation
router.post('/insertFunctionData', employeeDetailsMiddleware, FunctionController.createFunction);

module.exports = router;
