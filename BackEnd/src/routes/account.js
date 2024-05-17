const express = require('express');
const UserController = require('../app/controllers/Accountcontrollers');
const router = express.Router();

router.get('/', UserController.index);
router.post('/', UserController.update);
router.get('/change-password', UserController.password)
router.post('/change-password', UserController.changePassword);

module.exports = router;