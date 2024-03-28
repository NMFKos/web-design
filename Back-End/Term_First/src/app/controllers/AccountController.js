

class AccountController {
    index(req, res) {
        res.render('account');
    }
}

module.exports = new AccountController;