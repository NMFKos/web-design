class AdminController {
    index(req, res) {
        res.render('admin', { layout: false });
    }
}

module.exports = new AdminController;