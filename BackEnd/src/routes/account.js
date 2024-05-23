const express = require('express');
const UserController = require('../app/controllers/Accountcontrollers');
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

router.get('/', UserController.index);
router.post('/', upload.single('avatar'), UserController.update);
router.get('/change-password', UserController.password)
router.post('/change-password', UserController.changePassword);
router.use('/your-posts', UserController.showPosts);

module.exports = router;