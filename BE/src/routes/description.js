const express = require('express');
const router = express.Router();

const descriptionController = require('../app/controllers/DescriptionController');
router.use('/', descriptionController.index)

module.exports = router;