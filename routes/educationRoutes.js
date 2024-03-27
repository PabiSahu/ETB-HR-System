// educationRoutes.js
const express = require('express');
const educationController = require('../controllers/educationController');
const router = express.Router();

router.get('/education', (req, res) => {
  // Your logic for rendering the education page
  res.render('education'); // Adjust this based on your template rendering setup
});

router.post('/update', educationController.updateEducationDetails);

module.exports = router;
