const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
router.use(methodOverride('_method'));


const adminController = require('../app/controllers/AdminController');
router.use('/bao-cao', (req, res) => {
    adminController.reports(req, res);
})

router.use('/yeu-cau', (req, res) => {
    adminController.requests(req, res);
    router.delete('/:id', adminController.deletePost);
})


router.get('/', adminController.index);
router.get('/dang-xuat', adminController.logout);

module.exports = router;