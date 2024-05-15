const express = require('express');
const router = express.Router();
const multer = require('multer');

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
const postController = require('../app/controllers/PostController');
router.get('/', postController.index)

// Xử lý yêu cầu POST để tải ảnh lên
router.post('/', upload.array('image', 5), (req, res) => {
    res.send('Ảnh đã được tải lên và lưu trữ thành công.');
});


module.exports = router;