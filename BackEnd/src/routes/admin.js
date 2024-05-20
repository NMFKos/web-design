const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
const AdminController = require('../app/controllers/AdminController');
router.use('/bao-cao', (req, res) => {
    adminController.reports(req, res);
})

router.use('/yeu-cau', (req, res) => {
    adminController.requests(req, res);
})

router.post('/update-post-status', AdminController.updatePostStatus);

router.get('/', adminController.index);
router.get('/dang-xuat', adminController.logout);

module.exports = router;