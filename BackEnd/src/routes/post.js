const express = require('express');
const router = express.Router();

const postController = require('../app/controllers/PostController');
router.get('/', postController.index)

module.exports = router;