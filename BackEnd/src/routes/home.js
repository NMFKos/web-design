const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/HomeController');

router.post('/dang-nhap', homeController.login);
router.get('/dang-nhap', homeController.showLogin);
router.get('/dang-xuat', homeController.logout);
router.get('/can-ho-mot-phong-ngu', (req, res) => {
    homeController.filter(req, res, "1PN");
});
router.get('/can-ho-hai-phong-ngu', (req, res) => {
    homeController.filter(req, res, "2PN");
});
router.get('/can-ho-duplex', (req, res) => {
    homeController.filter(req, res, "Duplex");
});
router.get('/can-ho-studio', (req, res) => {
    homeController.filter(req, res, "Studio");
});
router.get('/bang-gia', homeController.showPriceList);
router.get('/', homeController.index)
module.exports = router;