const express = require('express');
const router = express.Router();

const detailController = require('../app/controllers/DetailpageController');
router.get('/:slug', detailController.index)
router.post('/:slug', detailController.report)

module.exports = router;