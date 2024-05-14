const express = require('express');
const UserController = require('../app/controllers/Accountcontrollers');
const router = express.Router();

router.get('/account/:id', UserController.index);
// Trong account.js
router.post('/account/:id', UserController.update);

module.exports = router;