const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/HomeController');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '850336766939-4orv854q5rhc1s0jdsu2mh0ab2cgif25.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://onehousedev.onrender.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

// Đăng nhập bằng tài khoản google
router.get('/google-success', (req, res) => {
    homeController.googleAuth(req, res, userProfile);
});
router.get('/google-error', (req, res) => res.send("error logging in"));
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/google-error' }),
  function(req, res) {
    res.redirect('/google-success');
  });

// Filter phòng trọ theo loại phòng trọ
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

// Đăng nhập tài khoản mặc định và đăng xuất
router.post('/dang-nhap', homeController.login);
router.get('/dang-nhap', homeController.showLogin);
router.get('/dang-xuat', homeController.logout);

// Load bảng giá dịch vụ (trang tĩnh)
router.get('/bang-gia', homeController.showPriceList);

// Quên mật khẩu và reset mật khẩu
router.get('/forgot-password', homeController.showForgot);
router.post('/forgot-password', homeController.forgot);
router.get('/reset-password', homeController.showReset);
router.post('/reset-password', homeController.reset);

// Load trang chủ và chức năng tìm kiếm
router.post('/search', homeController.search);
router.get('/', homeController.index)

module.exports = router;
