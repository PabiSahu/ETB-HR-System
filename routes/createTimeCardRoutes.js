// createTimeCardRoutes.js
const express = require('express');
const router = express.Router();

router.get('/createTimeCard', (req, res) => {
  res.render('createTimeCard.ejs');
});

module.exports = router;
