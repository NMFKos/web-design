const express = require('express');
const UserController = require('../app/controllers/Accountcontrollers');
const router = express.Router();

router.get('/', UserController.index);
router.post('/account/:id', UserController.update);
router.post('/account/:id/change-password', UserController.changePassword);

module.exports = router;