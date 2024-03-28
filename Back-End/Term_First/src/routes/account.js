const express = require('express');
const router = express.Router();

const accountController = require('../app/controllers/AccountController');
router.use('/', accountController.index)

module.exports = router;