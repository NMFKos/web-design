class SiteController {
    index(req, res) {
        res.render('home', { showHeader: true });
    }
    login(req, res) {
        res.render('login', { showHeader: false });
    }
}

module.exports = new SiteController;