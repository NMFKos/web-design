class SiteController {
    index(req, res) {
        res.render('home');
    }
    login(req, res) {
        res.render('login');
    }
}

module.exports = new SiteController;