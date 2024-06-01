const express = require('express');
const router = express.Router();

const detailController = require('../app/controllers/DetailpageController');
router.get('/payment-link', detailController.onlinePay)
router.get('/payment-success', detailController.success)
router.get('/payment-failure', detailController.cancel)
router.get('/:slug', detailController.index)
router.post('/:slug', detailController.ReportRating)

module.exports = router;