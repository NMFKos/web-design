class PostController {
    index(req, res) {
        res.render('post', { showHeader: true });
    }

    postnew(req, res) {
        res.render('post', { showHeader: true });
    }
}

module.exports = new PostController;