const express = require('express');
const router = express.Router();

const reportController = require('../app/controllers/ReportController');
router.get('/', reportController.index)
router.post('/', reportController.report)

module.exports = router;