// routes.js
const express = require('express');
const router = express.Router();
const menuDetailsController = require('../controllers/menuDetailsController');  // controllers/userRoleDetailsController

router.get('/menuDetails',menuDetailsController.getMenuData);

router.post('/menuDetails/update', menuDetailsController.updateMenuDetails);

module.exports = router;
