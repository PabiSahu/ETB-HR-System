// MneuRoutes.js

const express = require('express');
const router = express.Router();

// Import the MenuController
const MenuController = require('../controllers/MenuController');

const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');


// GET route to render the HTML page
// router.get('/Menu', (req, res) => {
//     // Your logic for rendering the MneuForm page
//     res.render('Menu', { responsibilityNames: responsibilityNames }); // Adjust this based on your template rendering setup
// });
router.get('/Menu',employeeDetailsMiddleware, MenuController.renderMenuPage);

// POST route to handle menu creation
router.post('/insertMenuData',employeeDetailsMiddleware, MenuController.createMenu);

module.exports = router;
