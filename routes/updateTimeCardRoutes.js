const express = require('express');
const router = express.Router();
const updateTimeCardController = require('../controllers/updateTimeCardController');
 
// GET request to fetch and render the time card details
router.get('/getupdateTimeCard', updateTimeCardController.getupdateTimeCard);
 
// POST request to approve a time card
router.post('/approveTimeCard/:projtimeCardId', updateTimeCardController.approveTimeCard);
 
// POST request to reject a time card
router.post('/rejectTimeCard/:projtimeCardId', updateTimeCardController.rejectTimeCard);
 
module.exports = router;
 