// routes.js
const express = require('express');
const router = express.Router();
const functionDetailsController = require('../controllers/FunctionDetailsController');  // controllers\FunctionDetailsController.js

router.get('/functionDetails',functionDetailsController.getFunctionData);

router.post('/functionDetails/update', functionDetailsController.updateFunctionDetails);

module.exports = router;

