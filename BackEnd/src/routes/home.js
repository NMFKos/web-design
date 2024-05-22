const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/HomeController');
const passport = require('passport')
const  session = require('express-session');
const googleAuthDal = require('../app/google-auth');
require('../public/script/google-auth');

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
router.post('/', homeController.search);
router.get('/', homeController.index)

function isLogged(req, res, next){
    req.user ? next() : res.sendStatus(401);
}

router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get( '/auth/google/callback',
passport.authenticate( 'google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
}));

router.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

router.use(passport.initialize());
router.use(passport.session());
router.get('/auth/google/success',isLogged,async (req, res)=>{
    await googleAuthDal.registerWithGoogle(req, res, userProfile);
    
})
router.get('/auth/google/failure',isLogged, (res,req)=>{
    res.redirect('/dang-nhap')
})
module.exports = router;