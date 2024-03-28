class AdminController {
    index(req, res) {
        res.render('admin');
    }
}

module.exports = new AdminController;