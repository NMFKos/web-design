const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../app/controllers/PostController');

// Cấu hình multer để lưu ảnh trên máy chủ local
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Thư mục trên máy chủ để lưu trữ các tệp
        cb(null, 'src/public/storage/');
    },
    filename: function(req, file, cb) {
        // Tên tệp sau khi lưu trữ trên máy chủ
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/payment', postController.show);
router.post('/payment-link', postController.pay)
router.get('/payment-failure', postController.cancel)
router.get('/payment-success', postController.success)
router.get('/', postController.index)
router.post('/', upload.array('image', 5), postController.postnew);

module.exports = router;