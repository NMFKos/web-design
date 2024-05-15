const express = require('express');
const router = express.Router();

const homeController = require('../app/controllers/HomeController');
router.use('/can-ho-mot-phong-ngu', (req, res) => {
    homeController.filter(req, res, "1PN");
});
router.use('/can-ho-hai-phong-ngu', (req, res) => {
    homeController.filter(req, res, "2PN");
});
router.use('/can-ho-duplex', (req, res) => {
    homeController.filter(req, res, "Duplex");
});
router.use('/can-ho-studio', (req, res) => {
    homeController.filter(req, res, "Studio");
});
router.use('/bang-gia', homeController.show);
router.use('/', homeController.index)
module.exports = router;