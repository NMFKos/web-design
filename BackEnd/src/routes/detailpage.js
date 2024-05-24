const express = require('express');
const router = express.Router();

const detailController = require('../app/controllers/DetailpageController');
router.get('/:slug', detailController.index)
router.post('/:slug', detailController.ReportRating)

module.exports = router;