// ResponsibilityRoutes.js
const express = require('express');
const ResponsibilityController = require('../controllers/ResponsibilityController');
const router = express.Router();

const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

// Route to render responsibility page
// router.get('/responsibility', (req, res) => {
//   // Your logic for rendering the responsibility page
//   res.render('responsibility'); // Adjust this based on your template rendering setup
// });
router.get('/responsibility',employeeDetailsMiddleware, ResponsibilityController.renderRolePage);
// Route to insert responsibility data
router.post('/insertResponsibilityData', employeeDetailsMiddleware, ResponsibilityController.createResponsibility);

module.exports = router;
