const express = require('express');
const UserController = require('../app/controllers/Accountcontrollers');
const router = express.Router();

router.get('/', UserController.index);
router.post('/', UserController.update);
router.get('/change-password', UserController.password)
router.post('/change-password', UserController.changePassword);
router.use('/your-posts', UserController.showPosts);

module.exports = router;