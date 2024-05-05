const express = require('express');
const router = express.Router();

const descriptionController = require('../app/controllers/DescriptionController');
router.get('/', descriptionController.index)

module.exports = router;