// loginRoutes.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.renderLoginPage);
router.post('/login', loginController.authenticateUser);

module.exports = router;
