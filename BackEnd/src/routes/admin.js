const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
router.use('/bao-cao', (req, res) => {
    adminController.reports(req, res);
})

router.use('/yeu-cau', (req, res) => {
    adminController.requests(req, res);
})

router.get('/', adminController.index)

module.exports = router;