const express = require('express');
const router = express.Router();

const detailController = require('../app/controllers/DetailpageController');
router.use('/:slug', detailController.index)

module.exports = router;