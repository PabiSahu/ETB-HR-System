



// routes.js
const express = require('express');
const router = express.Router();
const UserRoleController = require('../controllers/userRoleAssignController');

// Route to render the insert form
router.get('/userRole', UserRoleController.renderInsertForm);

// Route to handle the insertion of user roles
router.post('/insertUserRole', UserRoleController.insertUserRole);

// Route to fetch usernames
router.get('/getUsernames', UserRoleController.getUsernames);

// Route to fetch role names
router.get('/getRoleNames', UserRoleController.getRoleNames);

module.exports = router;
