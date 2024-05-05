class AdminController {
    index(req, res) {
        res.render('admin', { showAdmin: true });
    }
}

module.exports = new AdminController;