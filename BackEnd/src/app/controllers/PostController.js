class AccountController {
    index(req, res) {
        res.render('post');
    }
}

module.exports = new AccountController;