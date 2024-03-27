// // routes.js
// const express = require('express');
// const router = express.Router();
// const userRoleDetails = require('../controllers/userRoleDetailsController');

// router.get('/AssignedUserRoleDetails', userRoleDetailsController.getData);

// module.exports = router;

// routes.js
const express = require('express');
const router = express.Router();
const userRoleDetailsController = require('../controllers/userRoleDetailsController');  // controllers/userRoleDetailsController

router.get('/userRoleDetails',userRoleDetailsController.getData);

router.post('/responsibility/update', userRoleDetailsController.updateUserRoleDetails);

module.exports = router;


// updateUserRoleDetails