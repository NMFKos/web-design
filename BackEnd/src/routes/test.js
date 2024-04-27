const express = require('express');
const router = express.Router();

const testController = require('../app/controllers/test');
router.use('/', testController.index)

module.exports = router;