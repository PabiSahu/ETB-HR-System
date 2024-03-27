// CardTableRoutes.js
const express = require('express');
const CardTableController = require('../controllers/CardTableController');
 
const router = express.Router();

const employeeDetailsMiddleware = require('../employeeDetailsMiddleware');

router.get('/getCardData', employeeDetailsMiddleware, CardTableController.getCardData);
router.get('/deleteRecord/:id', employeeDetailsMiddleware, CardTableController.deleteRecord);
 
module.exports = router;